import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectProjectDomain, selectProjectsList } from '../project.selectors';

describe('Project: selectors', () => {
  const state = Immutable({
    project: {
      projects: [],
      project: {},
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

  describe('selectProjectsList', () => {
    it('should select a single project', () => {
      expect(selectProjectsList(state)).to.equal(state.project.project);
    });
  });
});
