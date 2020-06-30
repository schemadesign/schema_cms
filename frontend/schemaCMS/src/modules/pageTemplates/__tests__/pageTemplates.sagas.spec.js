import { expectSaga } from 'redux-saga-test-plan';
import Immutable from 'seamless-immutable';
import { OK } from 'http-status-codes';

import { watchPageTemplates } from '../pageTemplates.sagas';
import { PageTemplatesRoutines } from '../pageTemplates.redux';
import mockApi from '../../../shared/utils/mockApi';
import { PAGE_TEMPLATES_PATH, PROJECTS_PATH } from '../../../shared/utils/api.constants';
import { ProjectRoutines } from '../../project';

describe('PageTemplates: sagas', () => {
  const defaultState = Immutable({});

  describe('when /FETCH_PAGE_TEMPLATES action is fired', () => {
    it('should put fetchPageTemplates action', async () => {
      const projectId = 'projectId';
      const response = {
        id: 1,
        results: [],
        project: {},
      };

      mockApi.get(`${PROJECTS_PATH}/${projectId}${PAGE_TEMPLATES_PATH}`).reply(OK, response);

      await expectSaga(watchPageTemplates)
        .withState(defaultState)
        .put(PageTemplatesRoutines.fetchPageTemplates.success(response.results))
        .dispatch(PageTemplatesRoutines.fetchPageTemplates({ projectId }))
        .silentRun();
    });
  });

  describe('when /FETCH_PAGE_TEMPLATE action is fired', () => {
    it('should put fetchPageTemplate action', async () => {
      const pageTemplateId = 'pageTemplateId';
      const response = {
        id: 1,
        results: [],
        project: {},
      };

      mockApi.get(`${PAGE_TEMPLATES_PATH}/${pageTemplateId}`).reply(OK, response);

      await expectSaga(watchPageTemplates)
        .withState(defaultState)
        .put(ProjectRoutines.setProject.trigger(response.project))
        .put(PageTemplatesRoutines.fetchPageTemplate.success(response.results))
        .dispatch(PageTemplatesRoutines.fetchPageTemplate({ pageTemplateId }))
        .silentRun();
    });
  });

  describe('when /CREATE_PAGE_TEMPLATE action is fired', () => {
    it('should put createPageTemplate action', async () => {
      const projectId = 'projectId';
      const formData = {};
      const response = {
        id: 1,
        results: [],
        project: {},
      };

      mockApi.post(`${PROJECTS_PATH}/${projectId}${PAGE_TEMPLATES_PATH}`, formData).reply(OK, response);

      await expectSaga(watchPageTemplates)
        .withState(defaultState)
        .put(PageTemplatesRoutines.createPageTemplate.success(response.results))
        .dispatch(PageTemplatesRoutines.createPageTemplate({ projectId, formData }))
        .silentRun();
    });
  });

  describe('when /UPDATE_PAGE_TEMPLATE action is fired', () => {
    it('should put updatePageTemplate action', async () => {
      const pageTemplateId = 'pageTemplateId';
      const formData = {};
      const response = {
        id: 1,
      };

      mockApi.patch(`${PAGE_TEMPLATES_PATH}/${pageTemplateId}`, formData).reply(OK, response);

      await expectSaga(watchPageTemplates)
        .withState(defaultState)
        .put(PageTemplatesRoutines.updatePageTemplate.success(response))
        .dispatch(PageTemplatesRoutines.updatePageTemplate({ pageTemplateId, formData }))
        .silentRun();
    });
  });

  describe('when /REMOVE_PAGE_TEMPLATE action is fired', () => {
    it('should put removePageTemplate action', async () => {
      const pageTemplateId = 'pageTemplateId';
      const response = {
        id: 1,
        results: [],
      };

      mockApi.delete(`${PAGE_TEMPLATES_PATH}/${pageTemplateId}`).reply(OK, response);

      await expectSaga(watchPageTemplates)
        .withState(defaultState)
        .put(PageTemplatesRoutines.removePageTemplate.success(response.results))
        .dispatch(PageTemplatesRoutines.removePageTemplate({ pageTemplateId }))
        .silentRun();
    });
  });

  describe('when /COPY_PAGE_TEMPLATE action is fired', () => {
    it('should put copyPageTemplate action', async () => {
      const pageTemplateId = 'pageTemplateId';
      const projectId = 'projectId';
      const responseList = {
        id: 1,
        results: [],
        project: {},
      };

      mockApi.post(`${PAGE_TEMPLATES_PATH}/${pageTemplateId}/copy`).reply(OK);
      mockApi.get(`${PROJECTS_PATH}/${projectId}${PAGE_TEMPLATES_PATH}`).reply(OK, responseList);

      await expectSaga(watchPageTemplates)
        .withState(defaultState)
        .put(PageTemplatesRoutines.copyPageTemplate.success())
        .put(PageTemplatesRoutines.fetchPageTemplates.trigger({ projectId }))
        .dispatch(PageTemplatesRoutines.copyPageTemplate({ pageTemplateId, projectId }))
        .silentRun();
    });
  });
});
