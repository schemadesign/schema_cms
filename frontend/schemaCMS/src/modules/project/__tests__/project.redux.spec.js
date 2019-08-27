import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { reducer as projectReducer } from '../project.redux';

describe('Project: redux', () => {
  const state = Immutable({
    projects: [],
    isMenuOpen: false,
  });

  describe('reducer', () => {
    it('should return initial state', () => {
      expect(projectReducer(undefined, {})).to.deep.equal(state);
    });

    it('should return state on unknown action', () => {
      expect(projectReducer(state, { type: 'unknown-action' })).to.deep.equal(state);
    });
  });
});
