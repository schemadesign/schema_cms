import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectProjectDomain, selectProjectsList, selectProjectsMenu } from '../project.selectors';

describe('Project: selectors', () => {
  const state = Immutable({
    project: {
      projects: [],
      isMenuOpen: false,
    },
  });

  describe('selectProjectDomain', () => {
    it('should select a domain', () => {
      expect(selectProjectDomain(state)).to.equal(state.project);
    });

    it('should select a projects list', () => {
      expect(selectProjectsList(state)).to.equal(state.project.projects);
    });

    it('should select a menu', () => {
      expect(selectProjectsMenu(state)).to.equal(state.project.isMenuOpen);
    });
  });
});
