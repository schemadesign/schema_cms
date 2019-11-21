import { expectSaga } from 'redux-saga-test-plan';
import Immutable from 'seamless-immutable';
import nock from 'nock';
import { OK } from 'http-status-codes';

import { watchDirectory } from '../directory.sagas';
import { DirectoryRoutines } from '../directory.redux';
import mockApi from '../../../shared/utils/mockApi';

describe('Directory: sagas', () => {
  const defaultState = Immutable({
    directories: [],
  });

  beforeEach(() => {
    nock.cleanAll();
  });

  describe('when fetchList action is called', () => {
    it('should put fetchList.success action', async () => {
      const response = {
        id: 1,
      };
      const payload = {
        projectId: 1,
      };

      mockApi.get(`/projects/${payload.projectId}/directories`).reply(OK, response);

      await expectSaga(watchDirectory)
        .withState(defaultState)
        .put(DirectoryRoutines.fetchList.success(response))
        .dispatch(DirectoryRoutines.fetchList(payload))
        .silentRun();
    });
  });

  describe('when create action is called', () => {
    it('should put create.success action', async () => {
      const response = {
        id: 1,
      };
      const payload = {
        projectId: 1,
        name: 'A directory name',
      };

      mockApi.post(`/projects/${payload.projectId}/directories`).reply(OK, response);

      await expectSaga(watchDirectory)
        .withState(defaultState)
        .put(DirectoryRoutines.create.success(response))
        .dispatch(DirectoryRoutines.create(payload))
        .silentRun();
    });
  });
});
