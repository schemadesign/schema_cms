import { expectSaga } from 'redux-saga-test-plan';
import Immutable from 'seamless-immutable';
import { OK } from 'http-status-codes';
import nock from 'nock';

import { watchTagCategory } from '../tagCategory.sagas';
import { TagCategoryRoutines } from '../tagCategory.redux';
import mockApi from '../../../shared/utils/mockApi';
import browserHistory from '../../../shared/utils/history';
import { ProjectRoutines } from '../../project';

describe('Tag Category: sagas', () => {
  const defaultState = Immutable({});

  beforeEach(() => {
    nock.cleanAll();
  });

  describe('when fetchTagCategories action is called', () => {
    it('should put fetchTagCategories.success action', async () => {
      const response = {
        id: 1,
        results: [],
      };
      const payload = {
        projectId: 1,
      };

      mockApi.get(`/projects/${payload.projectId}/tag-categories`).reply(OK, response);

      await expectSaga(watchTagCategory)
        .withState(defaultState)
        .put(TagCategoryRoutines.fetchTagCategories.success(response.results))
        .dispatch(TagCategoryRoutines.fetchTagCategories(payload))
        .silentRun();
    });
  });

  describe('when createTagCategory action is called', () => {
    it('should put createTagCategory.success action', async () => {
      const response = {
        id: 1,
      };
      const formData = { data: 'data' };
      const projectId = 1;
      const payload = { formData, projectId };
      jest.spyOn(browserHistory, 'push');

      mockApi.post(`/projects/${projectId}/tag-categories`, formData).reply(OK, response);

      await expectSaga(watchTagCategory)
        .withState(defaultState)
        .put(TagCategoryRoutines.createTagCategory.success(response))
        .dispatch(TagCategoryRoutines.createTagCategory(payload))
        .silentRun();

      expect(browserHistory.push).toBeCalledWith('/project/1/tag-categories');
    });
  });

  describe('when fetchTagCategory action is called', () => {
    it('should put fetchTagCategory.success action', async () => {
      const response = {
        results: {
          id: 1,
        },
        project: {
          title: 'projectTitle',
        },
      };
      const payload = {
        tagId: 1,
      };

      mockApi.get(`/tag-categories/${payload.tagId}`).reply(OK, response);

      await expectSaga(watchTagCategory)
        .withState(defaultState)
        .put(ProjectRoutines.setProject.trigger(response.project))
        .put(TagCategoryRoutines.fetchTagCategory.success(response.results))
        .dispatch(TagCategoryRoutines.fetchTagCategory(payload))
        .silentRun();
    });
  });

  describe('when updateTagCategory action is called', () => {
    it('should put updateTagCategory.success action', async () => {
      const response = {
        id: 1,
      };
      const formData = { data: 'data' };
      const projectId = 1;
      const tagId = 1;
      const payload = { formData, projectId, tagId };
      jest.spyOn(browserHistory, 'push');

      mockApi.patch(`/tag-categories/${tagId}`, formData).reply(OK, response);

      await expectSaga(watchTagCategory)
        .withState(defaultState)
        .put(TagCategoryRoutines.updateTagCategory.success(response))
        .dispatch(TagCategoryRoutines.updateTagCategory(payload))
        .silentRun();

      expect(browserHistory.push).toBeCalledWith('/project/1/tag-categories');
    });
  });

  describe('when removeTagCategory action is called', () => {
    it('should put removeTagCategory.success action', async () => {
      const response = {
        id: 1,
      };
      const projectId = 1;
      const tagId = 1;
      const payload = { projectId, tagId };
      jest.spyOn(browserHistory, 'push');

      mockApi.delete(`/tag-categories/${tagId}`).reply(OK, response);

      await expectSaga(watchTagCategory)
        .withState(defaultState)
        .put(TagCategoryRoutines.removeTagCategory.success(response))
        .dispatch(TagCategoryRoutines.removeTagCategory(payload))
        .silentRun();

      expect(browserHistory.push).toBeCalledWith('/project/1/tag-categories');
    });
  });
});
