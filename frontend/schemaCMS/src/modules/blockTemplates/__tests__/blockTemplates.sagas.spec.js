import { expectSaga } from 'redux-saga-test-plan';
import Immutable from 'seamless-immutable';
import { OK } from 'http-status-codes';

import { watchBlockTemplates } from '../blockTemplates.sagas';
import { BlockTemplatesRoutines } from '../blockTemplates.redux';
import mockApi from '../../../shared/utils/mockApi';
import { BLOCK_TEMPLATES_PATH, PROJECTS_PATH } from '../../../shared/utils/api.constants';
import { ProjectRoutines } from '../../project';

describe('BlockTemplates: sagas', () => {
  const defaultState = Immutable({});

  describe('when /FETCH_BLOCK_TEMPLATES action is fired', () => {
    it('should put fetchBlockTemplates action', async () => {
      const projectId = 'projectId';
      const response = {
        id: 1,
        results: [],
        project: {},
      };

      mockApi.get(`${PROJECTS_PATH}/${projectId}${BLOCK_TEMPLATES_PATH}`).reply(OK, response);

      await expectSaga(watchBlockTemplates)
        .withState(defaultState)
        .put(ProjectRoutines.setProject.trigger(response.project))
        .put(BlockTemplatesRoutines.fetchBlockTemplates.success(response.results))
        .dispatch(BlockTemplatesRoutines.fetchBlockTemplates({ projectId }))
        .silentRun();
    });
  });

  describe('when /FETCH_BLOCK_TEMPLATE action is fired', () => {
    it('should put fetchBlockTemplate action', async () => {
      const blockTemplateId = 'blockId';
      const response = {
        id: 1,
        results: {},
        project: {},
      };

      mockApi.get(`${BLOCK_TEMPLATES_PATH}/${blockTemplateId}`).reply(OK, response);

      await expectSaga(watchBlockTemplates)
        .withState(defaultState)
        .put(ProjectRoutines.setProject.trigger(response.project))
        .put(BlockTemplatesRoutines.fetchBlockTemplate.success(response.results))
        .dispatch(BlockTemplatesRoutines.fetchBlockTemplate({ blockTemplateId }))
        .silentRun();
    });
  });

  describe('when /CREATE_BLOCK_TEMPLATE action is fired', () => {
    it('should put createBlockTemplate action', async () => {
      const projectId = 'projectId';
      const formData = {};
      const response = {
        id: 1,
        results: {},
        project: {},
      };

      mockApi.post(`${PROJECTS_PATH}/${projectId}${BLOCK_TEMPLATES_PATH}`).reply(OK, response);

      await expectSaga(watchBlockTemplates)
        .withState(defaultState)
        .put(ProjectRoutines.setProject.trigger(response.project))
        .put(BlockTemplatesRoutines.createBlockTemplate.success(response.results))
        .dispatch(BlockTemplatesRoutines.createBlockTemplate({ projectId, formData }))
        .silentRun();
    });
  });

  describe('when /UPDATE_BLOCK_TEMPLATE action is fired', () => {
    it('should put updateBlockTemplate action', async () => {
      const blockTemplateId = 'blockTemplateId';
      const formData = {};
      const response = {
        id: 1,
      };

      mockApi.patch(`${BLOCK_TEMPLATES_PATH}/${blockTemplateId}`, formData).reply(OK, response);

      await expectSaga(watchBlockTemplates)
        .withState(defaultState)
        .put(BlockTemplatesRoutines.updateBlockTemplate.success(response))
        .dispatch(BlockTemplatesRoutines.updateBlockTemplate({ blockTemplateId, formData }))
        .silentRun();
    });
  });

  describe('when /REMOVE_BLOCK_TEMPLATE action is fired', () => {
    it('should put removeBlockTemplate action', async () => {
      const blockTemplateId = 'blockTemplateId';
      const response = {
        id: 1,
      };

      mockApi.delete(`${BLOCK_TEMPLATES_PATH}/${blockTemplateId}`).reply(OK, response);

      await expectSaga(watchBlockTemplates)
        .withState(defaultState)
        .put(BlockTemplatesRoutines.removeBlockTemplate.success(response))
        .dispatch(BlockTemplatesRoutines.removeBlockTemplate({ blockTemplateId }))
        .silentRun();
    });
  });
});
