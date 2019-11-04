import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { reducer as filterReducer } from '../filter.redux';

describe('Filter: redux', () => {
  const state = Immutable({});

  describe('reducer', () => {
    it('should return initial state', () => {
      expect(filterReducer(undefined, {})).to.deep.equal(state);
    });

    it('should return state on unknown action', () => {
      expect(filterReducer(state, { type: 'unknown-action' })).to.deep.equal(state);
    });
  });
});
