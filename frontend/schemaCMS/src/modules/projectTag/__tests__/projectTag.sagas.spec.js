import { expectSaga } from 'redux-saga-test-plan';
import Immutable from 'seamless-immutable';
import { OK } from 'http-status-codes';
import nock from 'nock';

import { watchProjectTag } from '../projectTag.sagas';
import { ProjectTagRoutines } from '../projectTag.redux';
import mockApi from '../../../shared/utils/mockApi';
import { PROJECTS_PATH, TAGS_PATH } from '../../../shared/utils/api.constants';
import browserHistory from '../../../shared/utils/history';
import { ProjectRoutines } from '../../project';

describe('Tag: sagas', () => {
  const defaultState = Immutable({});

  beforeEach(() => {
    nock.cleanAll();
  });

  describe('when fetchList action is called', () => {
    it('should put fetchList.success action', async () => {
      const response = {
        id: 1,
        results: [],
      };
      const payload = {
        projectId: 1,
      };

      mockApi.get(`/projects/${payload.projectId}/tags-lists`).reply(OK, response);

      await expectSaga(watchProjectTag)
        .withState(defaultState)
        .put(ProjectTagRoutines.fetchList.success(response.results))
        .dispatch(ProjectTagRoutines.fetchList(payload))
        .silentRun();
    });
  });

  describe('when setTags action is called', () => {
    it('should put setTags.success action', async () => {
      const response = {
        id: 1,
      };
      const active = [1];
      const inactive = [2, 3, 4];
      const payload = {
        projectId: 1,
        active,
        inactive,
      };

      mockApi.post(`${PROJECTS_PATH}/${payload.projectId}/set-tags-lists`, { active, inactive }).reply(OK, response);

      await expectSaga(watchProjectTag)
        .withState(defaultState)
        .put(ProjectTagRoutines.setTags.success(response))
        .dispatch(ProjectTagRoutines.setTags(payload))
        .silentRun();
    });
  });

  describe('when createTag action is called', () => {
    it('should put createTag.success action', async () => {
      const response = {
        id: 1,
      };
      const formData = { data: 'data' };
      const projectId = 1;
      const payload = { formData, projectId };
      jest.spyOn(browserHistory, 'push');

      mockApi.post(`${PROJECTS_PATH}/${projectId}/tags-lists`, formData).reply(OK, response);

      await expectSaga(watchProjectTag)
        .withState(defaultState)
        .put(ProjectTagRoutines.createTag.success(response))
        .dispatch(ProjectTagRoutines.createTag(payload))
        .silentRun();

      expect(browserHistory.push).toBeCalledWith('/project/1/tag');
    });
  });

  describe('when fetchTag action is called', () => {
    it('should put fetchTag.success action', async () => {
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

      mockApi.get(`${TAGS_PATH}/${payload.tagId}`).reply(OK, response);

      await expectSaga(watchProjectTag)
        .withState(defaultState)
        .put(ProjectRoutines.setProject.trigger(response.project))
        .put(ProjectTagRoutines.fetchTag.success(response.results))
        .dispatch(ProjectTagRoutines.fetchTag(payload))
        .silentRun();
    });
  });

  describe('when updateTag action is called', () => {
    it('should put updateTag.success action', async () => {
      const response = {
        id: 1,
      };
      const formData = { data: 'data' };
      const projectId = 1;
      const tagId = 1;
      const payload = { formData, projectId, tagId };
      jest.spyOn(browserHistory, 'push');

      mockApi.patch(`${TAGS_PATH}/${tagId}`, formData).reply(OK, response);

      await expectSaga(watchProjectTag)
        .withState(defaultState)
        .put(ProjectTagRoutines.updateTag.success(response))
        .dispatch(ProjectTagRoutines.updateTag(payload))
        .silentRun();

      expect(browserHistory.push).toBeCalledWith('/project/1/tag');
    });
  });

  describe('when removeTag action is called', () => {
    it('should put removeTag.success action', async () => {
      const response = {
        id: 1,
      };
      const projectId = 1;
      const tagId = 1;
      const payload = { projectId, tagId };
      jest.spyOn(browserHistory, 'push');

      mockApi.delete(`${TAGS_PATH}/${tagId}`).reply(OK, response);

      await expectSaga(watchProjectTag)
        .withState(defaultState)
        .put(ProjectTagRoutines.removeTag.success(response))
        .dispatch(ProjectTagRoutines.removeTag(payload))
        .silentRun();

      expect(browserHistory.push).toBeCalledWith('/project/1/tag');
    });
  });
});
