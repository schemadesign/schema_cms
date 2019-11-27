import { expectSaga } from 'redux-saga-test-plan';
import Immutable from 'seamless-immutable';
import nock from 'nock';
import { OK } from 'http-status-codes';

import { watchFolder } from '../folder.sagas';
import { FolderRoutines } from '../folder.redux';
import mockApi from '../../../shared/utils/mockApi';
import browserHistory from '../../../shared/utils/history';

describe('Folder: sagas', () => {
  const defaultState = Immutable({
    folders: [],
    folder: {},
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

      mockApi.get(`/projects/${payload.projectId}/folders`).reply(OK, response);

      await expectSaga(watchFolder)
        .withState(defaultState)
        .put(FolderRoutines.fetchList.success(response))
        .dispatch(FolderRoutines.fetchList(payload))
        .silentRun();
    });
  });

  describe('when fetchOne action is called', () => {
    it('should put fetchOne.success action', async () => {
      const response = {
        id: 1,
      };
      const payload = {
        folderId: 1,
      };

      mockApi.get(`/folders/${payload.folderId}`).reply(OK, response);

      await expectSaga(watchFolder)
        .withState(defaultState)
        .put(FolderRoutines.fetchOne.success(response))
        .dispatch(FolderRoutines.fetchOne(payload))
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
        name: 'A folder name',
      };

      mockApi.post(`/projects/${payload.projectId}/folders`, { name: payload.name }).reply(OK, response);

      await expectSaga(watchFolder)
        .withState(defaultState)
        .put(FolderRoutines.create.success(response))
        .dispatch(FolderRoutines.create(payload))
        .silentRun();

      expect(browserHistory.push).toBeCalledWith(`/project/${payload.projectId}/folder`);
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
        folderId: 2,
        name: 'A folder name',
      };

      mockApi.patch(`/folders/${payload.folderId}`, { name: payload.name }).reply(OK, response);

      await expectSaga(watchFolder)
        .withState(defaultState)
        .put(FolderRoutines.update.success(response))
        .dispatch(FolderRoutines.update(payload))
        .silentRun();

      expect(browserHistory.push).toBeCalledWith(`/project/${payload.projectId}/folder`);
    });
  });
});
