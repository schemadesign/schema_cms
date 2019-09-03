import Immutable from 'seamless-immutable';
import { expectSaga } from 'redux-saga-test-plan';
import { OK } from 'http-status-codes';

import { watchDataSource } from '../dataSource.sagas';
import { DataSourceRoutines } from '../dataSource.redux';
import mockApi from '../../../shared/utils/mockApi';
import { DATA_SOURCE_PATH, PROJECTS_PATH } from '../../../shared/utils/api.constants';

describe('DataSource: sagas', () => {
  const defaultState = Immutable({});

  describe('create', () => {
    it('should dispatch a success action', async () => {
      const payload = { projectId: 1 };
      const requestData = {
        project: payload.projectId,
        name: null,
        type: 'file',
        file: null,
      };
      const responseData = {
        id: 1,
        status: 'draft',
      };

      mockApi.post(`${PROJECTS_PATH}/${payload.projectId}${DATA_SOURCE_PATH}`, requestData).reply(OK, responseData);

      await expectSaga(watchDataSource)
        .withState(defaultState)
        .put(DataSourceRoutines.create.success(responseData))
        .dispatch(DataSourceRoutines.create(payload))
        .run();
    });
  });
});
