import { expectSaga } from 'redux-saga-test-plan';
import Immutable from 'seamless-immutable';
import { OK } from 'http-status-codes';

import { watchPage } from '../page.sagas';
import { PageRoutines } from '../page.redux';
import mockApi from '../../../shared/utils/mockApi';
import browserHistory from '../../../shared/utils/history';
import { PAGES_PATH } from '../../../shared/utils/api.constants';
import { ProjectRoutines } from '../../project';

describe('Page: sagas', () => {
  const defaultState = Immutable({
    pages: [],
  });

  describe('when fetchList action is called', () => {
    it('should put fetchList.success action', async () => {
      const response = {
        id: 1,
        results: [],
        project: {},
      };
      const payload = {
        folderId: 1,
      };

      mockApi.get(`/folders/${payload.folderId}/pages`).reply(OK, response);

      await expectSaga(watchPage)
        .withState(defaultState)
        .put(ProjectRoutines.setProject.trigger(response.project))
        .put(PageRoutines.fetchList.success(response.results))
        .dispatch(PageRoutines.fetchList(payload))
        .silentRun();
    });
  });

  describe('when fetchOne action is called', () => {
    it('should put fetchOne.success action', async () => {
      const response = {
        id: 1,
        project: {},
      };
      const payload = {
        pageId: 1,
      };

      mockApi.get(`/pages/${payload.pageId}`).reply(OK, response);

      await expectSaga(watchPage)
        .withState(defaultState)
        .put(ProjectRoutines.setProject.trigger(response.project))
        .put(PageRoutines.fetchOne.success(response))
        .dispatch(PageRoutines.fetchOne(payload))
        .silentRun();
    });
  });

  describe('when create action is called', () => {
    it('should put create.success action', async () => {
      const response = {
        id: 1,
      };
      const payload = {
        folderId: 1,
        title: 'a title',
      };

      mockApi.post(`/folders/${payload.folderId}/pages`, { title: payload.title }).reply(OK, response);

      await expectSaga(watchPage)
        .withState(defaultState)
        .put(PageRoutines.create.success(response))
        .dispatch(PageRoutines.create(payload))
        .silentRun();
    });
  });

  describe('when update action is called', () => {
    it('should put update.success action', async () => {
      jest.spyOn(browserHistory, 'push');
      const response = {
        id: 1,
      };
      const payload = {
        folderId: 1,
        pageId: 2,
        title: 'a title',
      };

      mockApi.patch(`/pages/${payload.pageId}`, { title: payload.title }).reply(OK, response);

      await expectSaga(watchPage)
        .withState(defaultState)
        .put(PageRoutines.update.success(response))
        .dispatch(PageRoutines.update(payload))
        .silentRun();

      expect(browserHistory.push).toBeCalledWith(`/folder/${payload.folderId}`);
    });
  });

  describe('removeOne', () => {
    it('should dispatch a success action', async () => {
      jest.spyOn(browserHistory, 'push');
      const payload = { folderId: '1', pageId: '1' };

      mockApi.delete(`${PAGES_PATH}/${payload.pageId}`).reply(OK);

      await expectSaga(watchPage)
        .withState(defaultState)
        .put(PageRoutines.removeOne.success())
        .dispatch(PageRoutines.removeOne(payload))
        .silentRun();

      expect(browserHistory.push).toBeCalledWith(`/folder/${payload.folderId}/`);
    });
  });
});
