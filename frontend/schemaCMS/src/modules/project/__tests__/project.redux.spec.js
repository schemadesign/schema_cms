import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { reducer as projectReducer, ProjectActions } from '../project.redux';

describe('Project: redux', () => {
  const defaultState = Immutable({
    projects: [],
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
});
