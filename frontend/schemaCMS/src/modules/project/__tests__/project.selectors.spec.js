import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectProjectDomain, selectProjectsList, selectProject, selectEditors } from '../project.selectors';

describe('Project: selectors', () => {
  const state = Immutable({
    project: {
      projects: [],
      project: {},
      editors: [],
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

  describe('selectEditors', () => {
    it('should select a editors', () => {
      expect(selectEditors(state)).to.equal(state.project.editors);
    });
  });
});
