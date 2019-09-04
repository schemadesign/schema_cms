import Immutable from 'seamless-immutable';
import { expectSaga } from 'redux-saga-test-plan';
import { OK } from 'http-status-codes';

import { watchDataSource } from '../dataSource.sagas';
import { DataSourceRoutines } from '../dataSource.redux';
import mockApi from '../../../shared/utils/mockApi';
import { DATA_SOURCE_PATH, PROJECTS_PATH } from '../../../shared/utils/api.constants';
import { STATUS_DRAFT } from '../dataSource.constants';

describe('DataSource: sagas', () => {
  const defaultState = Immutable({});

  describe('create', () => {
    it('should dispatch a success action', async () => {
      const payload = { projectId: 1 };
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
      const payload = { projectId: 1, dataSourceId: 1 };
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
});
