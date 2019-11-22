import { expectSaga } from 'redux-saga-test-plan';
import Immutable from 'seamless-immutable';
import nock from 'nock';
import { OK } from 'http-status-codes';

import { watchDirectory } from '../directory.sagas';
import { DirectoryRoutines } from '../directory.redux';
import mockApi from '../../../shared/utils/mockApi';
import browserHistory from '../../../shared/utils/history';

describe('Directory: sagas', () => {
  const defaultState = Immutable({
    directories: [],
    directory: {},
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

  describe('when fetchOne action is called', () => {
    it('should put fetchOne.success action', async () => {
      const response = {
        id: 1,
      };
      const payload = {
        directoryId: 1,
      };

      mockApi.get(`/directories/${payload.directoryId}`).reply(OK, response);

      await expectSaga(watchDirectory)
        .withState(defaultState)
        .put(DirectoryRoutines.fetchOne.success(response))
        .dispatch(DirectoryRoutines.fetchOne(payload))
        .silentRun();
    });
  });

  describe('when create action is called', () => {
    it('should put create.success action', async () => {
      jest.spyOn(browserHistory, 'push');
      const response = {
        id: 1,
      };
      const payload = {
        projectId: 1,
        name: 'A directory name',
      };

      mockApi.post(`/projects/${payload.projectId}/directories`, { name: payload.name }).reply(OK, response);

      await expectSaga(watchDirectory)
        .withState(defaultState)
        .put(DirectoryRoutines.create.success(response))
        .dispatch(DirectoryRoutines.create(payload))
        .silentRun();

      expect(browserHistory.push).toBeCalledWith(`/project/${payload.projectId}/directory`);
    });
  });

  describe('when update action is called', () => {
    it('should put update.success action', async () => {
      jest.spyOn(browserHistory, 'push');
      const response = {
        id: 1,
      };
      const payload = {
        projectId: 1,
        directoryId: 2,
        name: 'A directory name',
      };

      mockApi.patch(`/directories/${payload.directoryId}`, { name: payload.name }).reply(OK, response);

      await expectSaga(watchDirectory)
        .withState(defaultState)
        .put(DirectoryRoutines.update.success(response))
        .dispatch(DirectoryRoutines.update(payload))
        .silentRun();

      expect(browserHistory.push).toBeCalledWith(`/project/${payload.projectId}/directory`);
    });
  });
});
