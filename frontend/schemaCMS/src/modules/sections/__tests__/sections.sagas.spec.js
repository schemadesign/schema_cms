import { expectSaga } from 'redux-saga-test-plan';
import Immutable from 'seamless-immutable';
import { OK } from 'http-status-codes';

import { watchSections } from '../sections.sagas';
import { SectionsRoutines } from '../sections.redux';
import mockApi from '../../../shared/utils/mockApi';
import { SECTIONS_PATH, PROJECTS_PATH } from '../../../shared/utils/api.constants';
import { ProjectRoutines } from '../../project';

describe('Sections: sagas', () => {
  const defaultState = Immutable({});

  describe('when /FETCH_SECTIONS action is fired', () => {
    it('should put fetchSections action', async () => {
      const projectId = 'projectId';
      const response = {
        id: 1,
        results: [],
        project: {},
      };

      mockApi.get(`${PROJECTS_PATH}/${projectId}${SECTIONS_PATH}`).reply(OK, response);

      await expectSaga(watchSections)
        .withState(defaultState)
        .put(SectionsRoutines.fetchSections.success(response.results))
        .dispatch(SectionsRoutines.fetchSections({ projectId }))
        .silentRun();
    });
  });

  describe('when /FETCH_INTERNAL_CONNECTIONS action is fired', () => {
    it('should put fetchInternalConnections action', async () => {
      const projectId = 'projectId';
      const response = {
        id: 1,
        results: [],
        project: {},
      };

      mockApi.get(`${PROJECTS_PATH}/${projectId}${SECTIONS_PATH}/internal-connections`).reply(OK, response);

      await expectSaga(watchSections)
        .withState(defaultState)
        .put(SectionsRoutines.fetchInternalConnections.success(response.results))
        .dispatch(SectionsRoutines.fetchInternalConnections({ projectId }))
        .silentRun();
    });
  });

  describe('when /FETCH_SECTION action is fired', () => {
    it('should put fetchSection action', async () => {
      const sectionId = 'sectionId';
      const response = {
        id: 1,
        results: {},
        project: {},
      };

      mockApi.get(`${SECTIONS_PATH}/${sectionId}`).reply(OK, response);

      await expectSaga(watchSections)
        .withState(defaultState)
        .put(ProjectRoutines.setProject.trigger(response.project))
        .put(SectionsRoutines.fetchSection.success({ ...response.results, isQuery: false }))
        .dispatch(SectionsRoutines.fetchSection({ sectionId }))
        .silentRun();
    });

    it('should put fetchSection action with query', async () => {
      const sectionId = 'sectionId';
      const response = {
        id: 1,
        results: {},
        project: {},
      };

      mockApi.get(`${SECTIONS_PATH}/${sectionId}?pages_order=name`).reply(OK, response);

      await expectSaga(watchSections)
        .withState(defaultState)
        .put(ProjectRoutines.setProject.trigger(response.project))
        .put(SectionsRoutines.fetchSection.success({ ...response.results, isQuery: true }))
        .dispatch(SectionsRoutines.fetchSection({ sectionId, pagesOrder: 'name' }))
        .silentRun();
    });
  });

  describe('when /CREATE_PAGE_TEMPLATE action is fired', () => {
    it('should put createSection action', async () => {
      const projectId = 'projectId';
      const formData = {};
      const response = {
        id: 1,
        results: [],
        project: {},
      };

      mockApi.post(`${PROJECTS_PATH}/${projectId}${SECTIONS_PATH}`, formData).reply(OK, response);

      await expectSaga(watchSections)
        .withState(defaultState)
        .put(ProjectRoutines.fetchOne.trigger({ projectId }))
        .put(SectionsRoutines.createSection.success(response.results))
        .dispatch(SectionsRoutines.createSection({ projectId, formData }))
        .silentRun();
    });
  });

  describe('when /UPDATE_PAGE_TEMPLATE action is fired', () => {
    it('should put updateSection action', async () => {
      const sectionId = 'sectionId';
      const formData = {};
      const response = {
        id: 1,
      };

      mockApi.patch(`${SECTIONS_PATH}/${sectionId}`, formData).reply(OK, response);

      await expectSaga(watchSections)
        .withState(defaultState)
        .put(SectionsRoutines.updateSection.success(response))
        .dispatch(SectionsRoutines.updateSection({ sectionId, formData }))
        .silentRun();
    });
  });

  describe('when /REMOVE_SECTION action is fired', () => {
    it('should put removeSection action', async () => {
      const sectionId = 'sectionId';
      const response = {
        id: 1,
        results: [],
      };

      mockApi.delete(`${SECTIONS_PATH}/${sectionId}`).reply(OK, response);

      await expectSaga(watchSections)
        .withState(defaultState)
        .put(SectionsRoutines.removeSection.success(response.results))
        .dispatch(SectionsRoutines.removeSection({ sectionId }))
        .silentRun();
    });
  });
});
