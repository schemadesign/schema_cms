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

  describe('when fetchPage action is called', () => {
    it('should put fetchPage.success action', async () => {
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
        .put(PageRoutines.fetchPage.success(response))
        .dispatch(PageRoutines.fetchPage(payload))
        .silentRun();
    });
  });

  describe('when createPage action is called', () => {
    it('should put createPage.success action', async () => {
      const response = {
        id: 1,
      };
      const payload = {
        folderId: 1,
        title: 'a title',
      };

      mockApi.post(`/sections/${payload.folderId}/pages`, { title: payload.title }).reply(OK, response);

      await expectSaga(watchPage)
        .withState(defaultState)
        .put(PageRoutines.createPage.success(response))
        .dispatch(PageRoutines.createPage(payload))
        .silentRun();
    });
  });

  describe('when updatePage action is called', () => {
    it('should put updatePage.success action', async () => {
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
        .put(PageRoutines.updatePage.success(response))
        .dispatch(PageRoutines.updatePage(payload))
        .silentRun();

      expect(browserHistory.push).toBeCalledWith(`/folder/${payload.folderId}`);
    });
  });

  describe('removePage', () => {
    it('should dispatch a success action', async () => {
      jest.spyOn(browserHistory, 'push');
      const payload = { folderId: '1', pageId: '1' };

      mockApi.delete(`${PAGES_PATH}/${payload.pageId}`).reply(OK);

      await expectSaga(watchPage)
        .withState(defaultState)
        .put(PageRoutines.removePage.success())
        .dispatch(PageRoutines.removePage(payload))
        .silentRun();

      expect(browserHistory.push).toBeCalledWith(`/folder/${payload.folderId}`);
    });
  });
});
