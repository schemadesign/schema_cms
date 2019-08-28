import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { reducer as projectReducer, ProjectActions } from '../project.redux';

describe('Project: redux', () => {
  const defaultState = Immutable({
    projects: [],
    project: {},
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

      const resultState = projectReducer(defaultState, ProjectActions.fetchListSuccess(projects));
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

      const resultState = projectReducer(defaultState, ProjectActions.fetchProjectSuccess(project));
      expect(resultState.project).to.deep.equal(project);
    });
  });
});
