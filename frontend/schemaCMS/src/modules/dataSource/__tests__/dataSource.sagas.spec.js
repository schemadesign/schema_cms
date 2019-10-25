import Immutable from 'seamless-immutable';
import { expectSaga } from 'redux-saga-test-plan';
import * as effects from 'redux-saga/effects';
import { BAD_REQUEST, OK } from 'http-status-codes';
import nock from 'nock';

import { watchDataSource } from '../dataSource.sagas';
import { DataSourceRoutines } from '../dataSource.redux';
import mockApi from '../../../shared/utils/mockApi';
import { DATA_SOURCES_PATH, PROJECTS_PATH } from '../../../shared/utils/api.constants';
import { STATUS_DONE, STATUS_DRAFT, STATUS_READY_FOR_PROCESSING } from '../dataSource.constants';
import browserHistory from '../../../shared/utils/history';

describe('DataSource: sagas', () => {
  const defaultState = Immutable({});

  beforeEach(() => {
    nock.cleanAll();
  });

  describe('create', () => {
    it('should dispatch a success action', async () => {
      const payload = { projectId: '1' };
      const requestData = { project: payload.projectId };
      const responseData = {
        id: 1,
        status: STATUS_DRAFT,
      };

      mockApi.post(`${DATA_SOURCES_PATH}`, requestData).reply(OK, responseData);

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
        status: STATUS_DONE,
      };

      mockApi.get(`${DATA_SOURCES_PATH}/${payload.dataSourceId}`).reply(OK, responseData);

      await expectSaga(watchDataSource)
        .withState(defaultState)
        .put(DataSourceRoutines.fetchOne.success(responseData))
        .dispatch(DataSourceRoutines.fetchOne(payload))
        .silentRun();
    });
  });

  describe('fetchList', () => {
    const payload = { projectId: '1' };
    const responseData = {
      results: [
        {
          jobs: [{ id: 1, jobState: 'processing' }],
        },
      ],
    };
    const responseDoneData = {
      results: [
        {
          jobs: [{ id: 1, jobState: 'succeed' }],
        },
      ],
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
        .put(DataSourceRoutines.fetchList.success(responseDoneData.results))
        .dispatch(DataSourceRoutines.fetchList(payload))
        .silentRun();
    });

    it('should dispatch a success action until processing of some elements finish', async () => {
      mockApi
        .get(`${PROJECTS_PATH}/${payload.projectId}${DATA_SOURCES_PATH}?page_size=1000`)
        .reply(OK, responseData)
        .get(`${PROJECTS_PATH}/${payload.projectId}${DATA_SOURCES_PATH}?page_size=1000`)
        .reply(OK, responseDoneData);

      await expectSaga(watchDataSource)
        .withState(defaultState)
        .put(DataSourceRoutines.fetchList.success(responseData.results))
        .put(DataSourceRoutines.fetchList.success(responseDoneData.results))
        .put(DataSourceRoutines.fetchList.fulfill())
        .dispatch(DataSourceRoutines.fetchList(payload))
        .silentRun();
    });

    it('should dispatch once fulfill actions after cancel', async () => {
      mockApi.get(`${PROJECTS_PATH}/${payload.projectId}${DATA_SOURCES_PATH}?page_size=1000`).reply(OK, responseData);

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
      },
    };
    const responseData = {
      id: 1,
      project: 1,
      status: STATUS_DRAFT,
    };

    describe('on success', () => {
      beforeEach(() => {
        const options = {
          headers: { 'Content-Type': 'multipart/form-data' },
        };

        mockApi
          .patch(`${DATA_SOURCES_PATH}/${payload.dataSourceId}`, /form-data; name="data"[^]*data/m, options)
          .reply(OK, responseData);

        mockApi
          .patch(`${DATA_SOURCES_PATH}/${payload.dataSourceId}`, { name: payload.requestData.name }, options)
          .reply(OK, responseData);
      });

      it('should dispatch a success action', async () => {
        await expectSaga(watchDataSource)
          .withState(defaultState)
          .put(DataSourceRoutines.updateOne.success(responseData))
          .dispatch(DataSourceRoutines.updateOne(payload))
          .silentRun();
      });

      it('should should redirect to next step', async () => {
        jest.spyOn(browserHistory, 'push');

        await expectSaga(watchDataSource)
          .withState(defaultState)
          .dispatch(DataSourceRoutines.updateOne(payload))
          .silentRun();

        expect(browserHistory.push).toBeCalledWith('/datasource/1/2');
      });

      it('should redirect to next step after send file', async () => {
        jest.spyOn(browserHistory, 'push');
        payload.requestData.file = 'file';

        await expectSaga(watchDataSource)
          .withState(defaultState)
          .dispatch(DataSourceRoutines.updateOne(payload))
          .silentRun();

        expect(browserHistory.push).toBeCalledWith('/datasource/1/2');
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

  describe('fetchFields', () => {
    it('should dispatch a success action', async () => {
      const payload = { projectId: '1', dataSourceId: '1' };
      const responseData = {
        fields: {
          id: {},
          name: {},
        },
        // eslint-disable-next-line camelcase
        data: [{ id: '1', name: 'test', snake_case_data: 'data' }],
      };

      mockApi.get(`${DATA_SOURCES_PATH}/${payload.dataSourceId}/preview`).reply(OK, responseData);

      await expectSaga(watchDataSource)
        .withState(defaultState)
        .put(DataSourceRoutines.fetchFields.success(responseData))
        .dispatch(DataSourceRoutines.fetchFields(payload))
        .silentRun();
    });
  });
});
