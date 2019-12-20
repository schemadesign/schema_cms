import Immutable from 'seamless-immutable';
import { expectSaga } from 'redux-saga-test-plan';
import * as effects from 'redux-saga/effects';
import { BAD_REQUEST, OK } from 'http-status-codes';
import nock from 'nock';

import { watchDataSource } from '../dataSource.sagas';
import { DataSourceRoutines } from '../dataSource.redux';
import mockApi from '../../../shared/utils/mockApi';
import { DATA_SOURCES_PATH, PROJECTS_PATH } from '../../../shared/utils/api.constants';
import browserHistory from '../../../shared/utils/history';
import { ProjectRoutines } from '../../project';
import { META_PROCESSING, META_SUCCESS } from '../dataSource.constants';

describe('DataSource: sagas', () => {
  const defaultState = Immutable({});

  beforeEach(() => {
    nock.cleanAll();
  });

  describe('create', () => {
    it('should dispatch a success action', async () => {
      const payload = { project: '1', requestData: { file: 'file' } };
      const responseData = {
        id: 1,
        metaData: null,
      };
      const options = {
        headers: { 'Content-Type': 'multipart/form-data' },
      };

      mockApi.post(DATA_SOURCES_PATH, /form-data; name="file"[^]*file/m, options).reply(OK, responseData);

      await expectSaga(watchDataSource)
        .withState(defaultState)
        .put(DataSourceRoutines.create.success(responseData))
        .dispatch(DataSourceRoutines.create(payload))
        .silentRun();
    });
  });

  describe('fetchOne', () => {
    it('should dispatch a success action', async () => {
      const payload = { projectId: '1', dataSourceId: '1' };
      const responseData = {
        id: 1,
        metaData: {},
        project: {},
      };

      mockApi.get(`${DATA_SOURCES_PATH}/${payload.dataSourceId}`).reply(OK, responseData);

      await expectSaga(watchDataSource)
        .withState(defaultState)
        .put(ProjectRoutines.setProject.trigger(responseData.project))
        .put(DataSourceRoutines.fetchOne.success(responseData))
        .dispatch(DataSourceRoutines.fetchOne(payload))
        .silentRun();
    });
  });

  describe('fetchList', () => {
    const payload = { projectId: '1' };
    const responseJobProcessingData = {
      results: [
        {
          activeJob: null,
          jobsInProcess: true,
          metaData: {
            status: META_SUCCESS,
          },
        },
      ],
    };
    const responseMetaProcessingData = {
      results: [
        {
          activeJob: null,
          jobsInProcess: true,
          metaData: {
            status: META_PROCESSING,
          },
        },
      ],
    };
    const responseDoneData = {
      results: [
        {
          activeJob: { id: 'id' },
          jobsInProcess: false,
          metaData: {
            status: META_SUCCESS,
          },
        },
      ],
      project: {},
    };

    beforeEach(() => {
      jest.spyOn(effects, 'delay').mockReturnValue(0);
    });

    it('should dispatch a success action', async () => {
      mockApi
        .get(`${PROJECTS_PATH}/${payload.projectId}${DATA_SOURCES_PATH}?page_size=1000`)
        .reply(OK, responseDoneData);

      await expectSaga(watchDataSource)
        .withState(defaultState)
        .put(ProjectRoutines.setProject.trigger(responseDoneData.project))
        .put(DataSourceRoutines.fetchList.success(responseDoneData.results))
        .dispatch(DataSourceRoutines.fetchList(payload))
        .silentRun();
    });

    it('should dispatch a success action until job processing finished', async () => {
      mockApi
        .get(`${PROJECTS_PATH}/${payload.projectId}${DATA_SOURCES_PATH}?page_size=1000`)
        .reply(OK, responseJobProcessingData)
        .get(`${PROJECTS_PATH}/${payload.projectId}${DATA_SOURCES_PATH}?page_size=1000`)
        .reply(OK, responseDoneData);

      await expectSaga(watchDataSource)
        .withState(defaultState)
        .put(DataSourceRoutines.fetchList.success(responseJobProcessingData.results))
        .put(DataSourceRoutines.fetchList.success(responseDoneData.results))
        .put(DataSourceRoutines.fetchList.fulfill())
        .dispatch(DataSourceRoutines.fetchList(payload))
        .silentRun();
    });

    it('should dispatch a success action until meta finished', async () => {
      mockApi
        .get(`${PROJECTS_PATH}/${payload.projectId}${DATA_SOURCES_PATH}?page_size=1000`)
        .reply(OK, responseMetaProcessingData)
        .get(`${PROJECTS_PATH}/${payload.projectId}${DATA_SOURCES_PATH}?page_size=1000`)
        .reply(OK, responseDoneData);

      await expectSaga(watchDataSource)
        .withState(defaultState)
        .put(DataSourceRoutines.fetchList.success(responseMetaProcessingData.results))
        .put(DataSourceRoutines.fetchList.success(responseDoneData.results))
        .put(DataSourceRoutines.fetchList.fulfill())
        .dispatch(DataSourceRoutines.fetchList(payload))
        .silentRun();
    });

    it('should dispatch once fulfill actions after cancel', async () => {
      mockApi
        .get(`${PROJECTS_PATH}/${payload.projectId}${DATA_SOURCES_PATH}?page_size=1000`)
        .reply(OK, responseJobProcessingData);

      await expectSaga(watchDataSource)
        .withState(defaultState)
        .put(DataSourceRoutines.fetchList.fulfill())
        .dispatch(DataSourceRoutines.fetchList(payload))
        .dispatch(DataSourceRoutines.cancelFetchListLoop(payload))
        .silentRun();
    });
  });

  describe('removeOne', () => {
    it('should dispatch a success action', async () => {
      const payload = { projectId: '1', dataSourceId: '1' };

      mockApi.delete(`${DATA_SOURCES_PATH}/${payload.dataSourceId}`).reply(OK);

      await expectSaga(watchDataSource)
        .withState(defaultState)
        .put(DataSourceRoutines.removeOne.success())
        .dispatch(DataSourceRoutines.removeOne(payload))
        .silentRun();
    });
  });

  describe('updateOne', () => {
    const payload = {
      projectId: '1',
      dataSourceId: '1',
      step: '1',
      requestData: {
        data: 'data',
        name: 'name',
        camelizeData: 'camelizeData',
      },
    };
    const responseData = {
      id: 1,
      project: 1,
      metaData: null,
    };

    describe('on success', () => {
      beforeEach(() => {
        mockApi
          .patch(`${DATA_SOURCES_PATH}/${payload.dataSourceId}`, { name: payload.requestData.name })
          .reply(OK, responseData);
      });

      it('should dispatch a success action', async () => {
        await expectSaga(watchDataSource)
          .withState(defaultState)
          .put(DataSourceRoutines.updateOne.success(responseData))
          .dispatch(DataSourceRoutines.updateOne(payload))
          .silentRun();
      });

      it('should redirect to list after send file', async () => {
        const options = {
          headers: { 'Content-Type': 'multipart/form-data' },
        };

        mockApi
          .patch(
            `${DATA_SOURCES_PATH}/${payload.dataSourceId}`,
            /form-data; name="camelize_data"[^]*camelizeData/m,
            options
          )
          .reply(OK, responseData);

        jest.spyOn(browserHistory, 'push');
        payload.requestData.file = 'file';

        await expectSaga(watchDataSource)
          .withState(defaultState)
          .dispatch(DataSourceRoutines.updateOne(payload))
          .silentRun();

        expect(browserHistory.push).toBeCalledWith('/project/1/datasource');
      });
    });

    it('should dispatch a failure action', async () => {
      const errorResponseData = { name: [{ code: 'code', message: 'message' }] };
      const errorResult = [{ code: 'code', name: 'name' }];
      mockApi.patch(`${DATA_SOURCES_PATH}/${payload.dataSourceId}`).reply(BAD_REQUEST, errorResponseData);

      await expectSaga(watchDataSource)
        .withState(defaultState)
        .put(DataSourceRoutines.updateOne.failure(errorResult))
        .dispatch(DataSourceRoutines.updateOne(payload))
        .silentRun();
    });
  });

  describe('fetchPreview', () => {
    it('should dispatch a success action', async () => {
      const payload = { projectId: '1', dataSourceId: '1' };
      const responseData = {
        results: {
          fields: {
            id: {},
            name: {},
          },
        },
        // eslint-disable-next-line camelcase
        data: [{ id: '1', name: 'test', snake_case_data: 'data' }],
      };

      mockApi.get(`${DATA_SOURCES_PATH}/${payload.dataSourceId}/preview`).reply(OK, responseData);

      await expectSaga(watchDataSource)
        .withState(defaultState)
        .put(DataSourceRoutines.fetchPreview.success(responseData.results))
        .dispatch(DataSourceRoutines.fetchPreview(payload))
        .silentRun();
    });
  });

  describe('fetchFieldsInfo', () => {
    it('should dispatch a success action', async () => {
      const payload = { dataSourceId: '1' };
      const responseData = {
        results: {
          field: { data: 'data' },
        },
        project: {},
      };

      mockApi.get(`${DATA_SOURCES_PATH}/${payload.dataSourceId}/fields-info`).reply(OK, responseData);

      await expectSaga(watchDataSource)
        .withState(defaultState)
        .put(ProjectRoutines.setProject.trigger(responseData.project))
        .put(DataSourceRoutines.fetchFieldsInfo.success(responseData.results))
        .dispatch(DataSourceRoutines.fetchFieldsInfo(payload))
        .silentRun();
    });
  });

  describe('revertToJob', () => {
    it('should dispatch a success action', async () => {
      const payload = { jobId: '1', dataSourceId: '1' };
      const response = { id: '1' };

      mockApi
        .post(`${DATA_SOURCES_PATH}/${payload.dataSourceId}/revert-job`, { id: payload.jobId })
        .reply(OK, response);

      await expectSaga(watchDataSource)
        .withState(defaultState)
        .put(DataSourceRoutines.revertToJob.success(response))
        .dispatch(DataSourceRoutines.revertToJob(payload))
        .silentRun();
    });
  });
});
