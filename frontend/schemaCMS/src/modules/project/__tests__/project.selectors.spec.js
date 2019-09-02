import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectProjectDomain, selectProjectsList, selectProject, selectIsFetched } from '../project.selectors';

describe('Project: selectors', () => {
  const state = Immutable({
    project: {
      projects: [],
      project: {},
      isFetched: false,
    },
  });

  describe('selectProjectDomain', () => {
    it('should select a domain', () => {
      expect(selectProjectDomain(state)).to.equal(state.project);
    });
  });

  describe('selectProjectsList', () => {
    it('should select a project list', () => {
      expect(selectProjectsList(state)).to.equal(state.project.projects);
    });
  });

  describe('selectProject', () => {
    it('should select a single project', () => {
      expect(selectProject(state)).to.equal(state.project.project);
    });
  });

  describe('selectIsFetched', () => {
    it('should select a single project', () => {
      expect(selectIsFetched(state)).to.equal(state.project.isFetched);
    });
  });
});
