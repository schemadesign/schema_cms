import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { reducer as projectReducer, ProjectRoutines } from '../project.redux';

describe('Project: redux', () => {
  const defaultState = Immutable({
    projects: [],
    project: {
      id: null,
    },
    editors: [],
    templates: {
      blocks: 0,
      pages: 0,
      tags: 0,
      states: 0,
    },
  });

  describe('reducer', () => {
    it('should return initial state', () => {
      expect(projectReducer(undefined, {})).to.deep.equal(defaultState);
    });

    it('should return state on unknown action', () => {
      expect(projectReducer(defaultState, { type: 'unknown-action' })).to.deep.equal(defaultState);
    });
  });

  describe('when PROJECTS/FETCH_LIST_SUCCESS action is received', () => {
    it('should set projects value', () => {
      const projects = [
        {
          title: 'Project Name',
          description: 'Description',
          slug: 'schemacms/api/project_title',
          created: '2019-08-26T11:05:12+0000',
          status: 'Status',
          owner: {
            id: '1',
            firstName: 'Firstname',
            lastName: 'Lastname',
          },
        },
      ];

      const resultState = projectReducer(defaultState, ProjectRoutines.fetchList.success(projects));
      expect(resultState.projects).to.deep.equal(projects);
    });
  });

  describe('when PROJECTS/FETCH_PROJECT_SUCCESS action is received', () => {
    it('should set project value', () => {
      const project = {
        title: 'Project Name',
        description: 'Description',
        slug: 'schemacms/api/project_title',
        created: '2019-08-26T11:05:12+0000',
        status: 'Status',
        owner: {
          id: '1',
          firstName: 'Firstname',
          lastName: 'Lastname',
        },
        editors: ['3da51ad7-a8b4-4755-b5d6-b51f01f1cb2e', '44da51ad7-a8b4-4355-b5d6-b51f01f1cb2e'],
        modified: '2019-08-21T10:12:52.030069Z',
      };

      const resultState = projectReducer(defaultState, ProjectRoutines.fetchOne.success(project));
      expect(resultState.project).to.deep.equal(project);
    });
  });

  describe('when PROJECTS/CREATE_PROJECT_SUCCESS action is received', () => {
    it('should merge project to list of projects', () => {
      const project = {
        title: 'Project Name 2',
        description: 'Description 2',
        slug: 'schemacms/api/project_title',
        created: '2019-08-26T11:05:12+0000',
        status: 'Status',
        owner: {
          id: '1',
          firstName: 'Firstname 2',
          lastName: 'Lastname 2',
        },
        editors: ['3da51ad7-a8b4-4755-b5d6-b51f01f1cb2e', '44da51ad7-a8b4-4355-b5d6-b51f01f1cb2e'],
        modified: '2019-08-21T10:12:52.030069Z',
      };

      const expectedProjects = [project];

      const resultState = projectReducer(defaultState, ProjectRoutines.createProject.success(project));
      expect(resultState.projects).to.deep.equal(expectedProjects);
    });
  });

  describe('when PROJECTS/EDIT_PROJECT_SUCCESS action is received', () => {
    it('should set project', () => {
      const project = {
        title: 'Project title',
      };

      const resultState = projectReducer(defaultState, ProjectRoutines.editProject.success(project));
      expect(resultState.project).to.deep.equal(project);
    });
  });

  describe('when PROJECTS/CLEAR_PROJECT action is received', () => {
    it('should clear project', () => {
      const resultState = projectReducer(defaultState, ProjectRoutines.clearProject());
      expect(resultState.project).to.deep.equal(defaultState.project);
    });
  });

  describe('when PROJECTS/FETCH_EDITORS_SUCCESS action is received', () => {
    it('should set editors', () => {
      const editors = [{ data: 'data' }];
      const resultState = projectReducer(defaultState, ProjectRoutines.fetchEditors.success(editors));
      expect(resultState.editors).to.deep.equal(editors);
    });
  });

  describe('when PROJECTS/FETCH_TEMPLATES_SUCCESS action is received', () => {
    it('should set templates', () => {
      const templates = { blocks: 1, pages: 2, filters: 3, states: 4 };
      const resultState = projectReducer(defaultState, ProjectRoutines.fetchTemplates.success(templates));

      expect(resultState.templates).to.deep.equal(templates);
    });
  });
});
