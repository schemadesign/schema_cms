import { expectSaga } from 'redux-saga-test-plan';
import Immutable from 'seamless-immutable';
import { OK } from 'http-status-codes';

import { watchPage } from '../page.sagas';
import { PageRoutines } from '../page.redux';
import mockApi from '../../../shared/utils/mockApi';
import browserHistory from '../../../shared/utils/history';
import { PAGES_PATH, PROJECTS_PATH } from '../../../shared/utils/api.constants';
import { ProjectRoutines } from '../../project';
import { SectionsRoutines } from '../../sections';

describe('Page: sagas', () => {
  const defaultState = Immutable({
    pages: [],
  });

  describe('when fetchPage action is called', () => {
    it('should put fetchPage.success action', async () => {
      const response = {
        id: 1,
        project: {
          id: 1,
        },
        results: {},
      };
      const payload = {
        pageId: 1,
      };

      mockApi.get(`/pages/${payload.pageId}`).reply(OK, response);

      await expectSaga(watchPage)
        .withState(defaultState)
        .put(ProjectRoutines.setProject.trigger(response.project))
        .put(PageRoutines.fetchPage.success({ ...response.results, projectId: response.project.id }))
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
        sectionId: 1,
        formData: {
          title: 'a title',
        },
      };

      mockApi.post(`/sections/${payload.sectionId}/pages`, payload.formData).reply(OK, response);

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
        pageId: 2,
        formData: {
          title: 'a title',
        },
      };

      mockApi.patch(`/pages/${payload.pageId}`, payload.formData).reply(OK, response);

      await expectSaga(watchPage)
        .withState(defaultState)
        .put(PageRoutines.updatePage.success(response))
        .dispatch(PageRoutines.updatePage(payload))
        .silentRun();
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

  describe('copyPage', () => {
    it('should dispatch a success action', async () => {
      const sectionId = 'sectionId';
      const pageId = 'pageId';
      const payload = { sectionId, pageId };

      mockApi.post(`${PAGES_PATH}/${pageId}/copy`).reply(OK);

      await expectSaga(watchPage)
        .withState(defaultState)
        .put(PageRoutines.copyPage.success())
        .put(SectionsRoutines.fetchPages.trigger({ sectionId }))
        .dispatch(PageRoutines.copyPage(payload))
        .silentRun();
    });
  });

  describe('publishPage', () => {
    it('should dispatch a success action', async () => {
      const payload = {
        pageId: 1,
      };

      mockApi.post(`${PAGES_PATH}/${payload.pageId}/publish`).reply(OK);

      await expectSaga(watchPage)
        .withState(defaultState)
        .put(PageRoutines.publishPage.success())
        .dispatch(PageRoutines.publishPage(payload))
        .silentRun();
    });
  });

  describe('fetchPageAdditionalData', () => {
    it('should dispatch a success action', async () => {
      const payload = { projectId: '1' };
      const response = {
        id: 1,
      };

      mockApi.get(`${PROJECTS_PATH}/${payload.projectId}/page-additional-data`).reply(OK, response);

      await expectSaga(watchPage)
        .withState(defaultState)
        .put(PageRoutines.fetchPageAdditionalData.success(response))
        .dispatch(PageRoutines.fetchPageAdditionalData(payload))
        .silentRun();
    });
  });
});
