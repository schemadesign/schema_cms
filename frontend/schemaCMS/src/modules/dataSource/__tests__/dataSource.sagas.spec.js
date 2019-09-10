import Immutable from 'seamless-immutable';
import { expectSaga } from 'redux-saga-test-plan';
import { OK } from 'http-status-codes';

import { watchDataSource } from '../dataSource.sagas';
import { DataSourceRoutines } from '../dataSource.redux';
import mockApi from '../../../shared/utils/mockApi';
import { DATA_SOURCE_PATH, PROJECTS_PATH } from '../../../shared/utils/api.constants';
import { STATUS_DRAFT } from '../dataSource.constants';
import browserHistory from '../../../shared/utils/history';

describe('DataSource: sagas', () => {
  const defaultState = Immutable({});

  describe('create', () => {
    it('should dispatch a success action', async () => {
      const payload = { projectId: '1' };
      const requestData = { project: payload.projectId };
      const responseData = {
        id: 1,
        status: STATUS_DRAFT,
      };

      mockApi.post(`${PROJECTS_PATH}/${payload.projectId}${DATA_SOURCE_PATH}`, requestData).reply(OK, responseData);

      await expectSaga(watchDataSource)
        .withState(defaultState)
        .put(DataSourceRoutines.create.success(responseData))
        .dispatch(DataSourceRoutines.create(payload))
        .run();
    });
  });

  describe('fetchOne', () => {
    it('should dispatch a success action', async () => {
      const payload = { projectId: '1', dataSourceId: '1' };
      const responseData = {
        id: 1,
        status: STATUS_DRAFT,
      };

      mockApi
        .get(`${PROJECTS_PATH}/${payload.projectId}${DATA_SOURCE_PATH}/${payload.dataSourceId}`)
        .reply(OK, responseData);

      await expectSaga(watchDataSource)
        .withState(defaultState)
        .put(DataSourceRoutines.fetchOne.success(responseData))
        .dispatch(DataSourceRoutines.fetchOne(payload))
        .run();
    });
  });

  describe('fetchList', () => {
    it('should dispatch a success action', async () => {
      const payload = { projectId: '1' };
      const responseData = {
        results: {
          dataSource: [],
        },
      };

      mockApi.get(`${PROJECTS_PATH}/${payload.projectId}${DATA_SOURCE_PATH}`).reply(OK, responseData);

      await expectSaga(watchDataSource)
        .withState(defaultState)
        .put(DataSourceRoutines.fetchList.success(responseData.results))
        .dispatch(DataSourceRoutines.fetchList(payload))
        .run();
    });
  });

  describe('removeOne', () => {
    it('should dispatch a success action', async () => {
      const payload = { projectId: '1', dataSourceId: '1' };

      mockApi.delete(`${PROJECTS_PATH}/${payload.projectId}${DATA_SOURCE_PATH}/${payload.dataSourceId}`).reply(OK);

      await expectSaga(watchDataSource)
        .withState(defaultState)
        .put(DataSourceRoutines.removeOne.success())
        .dispatch(DataSourceRoutines.removeOne(payload))
        .run();
    });
  });

  describe('updateOne', () => {
    const payload = {
      projectId: '1',
      dataSourceId: '1',
      step: '1',
      requestData: {
        data: 'data',
      },
    };
    const responseData = {
      id: 1,
      status: STATUS_DRAFT,
    };

    beforeEach(() => {
      const options = {
        headers: { 'Content-Type': 'multipart/form-data' },
      };

      mockApi
        .patch(
          `${PROJECTS_PATH}/${payload.projectId}${DATA_SOURCE_PATH}/${payload.dataSourceId}`,
          /form-data; name="data"[^]*data/m,
          options
        )
        .reply(OK, responseData);

      mockApi
        .post(`${PROJECTS_PATH}/${payload.projectId}${DATA_SOURCE_PATH}/${payload.dataSourceId}/process`)
        .reply(OK);
    });

    it('should dispatch a success action', async () => {
      await expectSaga(watchDataSource)
        .withState(defaultState)
        .put(DataSourceRoutines.updateOne.success(responseData))
        .dispatch(DataSourceRoutines.updateOne(payload))
        .run();
    });

    it('should should redirect to next step', async () => {
      jest.spyOn(browserHistory, 'push');

      await expectSaga(watchDataSource)
        .withState(defaultState)
        .dispatch(DataSourceRoutines.updateOne(payload))
        .run();

      expect(browserHistory.push).toBeCalledWith('/project/view/1/datasource/view/1/2');
    });

    it('should redirect to list', async () => {
      jest.spyOn(browserHistory, 'push');
      payload.requestData.file = 'file';

      await expectSaga(watchDataSource)
        .withState(defaultState)
        .dispatch(DataSourceRoutines.updateOne(payload))
        .run();

      expect(browserHistory.push).toBeCalledWith('/project/view/1/datasource/list');
    });
  });

  describe('processOne', () => {
    it('should dispatch a success action', async () => {
      const payload = {
        projectId: '1',
        dataSourceId: '1',
      };

      mockApi
        .post(`${PROJECTS_PATH}/${payload.projectId}${DATA_SOURCE_PATH}/${payload.dataSourceId}/process`)
        .reply(OK);

      await expectSaga(watchDataSource)
        .withState(defaultState)
        .put(DataSourceRoutines.processOne.success())
        .dispatch(DataSourceRoutines.processOne(payload))
        .run();
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
        data: [{ id: '1', name: 'test' }],
      };

      mockApi
        .get(`${PROJECTS_PATH}/${payload.projectId}${DATA_SOURCE_PATH}/${payload.dataSourceId}/preview`)
        .reply(OK, responseData);

      await expectSaga(watchDataSource)
        .withState(defaultState)
        .put(DataSourceRoutines.fetchFields.success(responseData))
        .dispatch(DataSourceRoutines.fetchFields(payload))
        .run();
    });
  });
});
