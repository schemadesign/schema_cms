import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { reducer as configReducer, ConfigRoutines } from '../config.redux';

describe('Config: redux', () => {
  const state = Immutable({});

  describe('reducer', () => {
    it('should return initial state', () => {
      expect(configReducer(undefined, {})).to.deep.equal(state);
    });

    it('should return state on unknown action', () => {
      expect(configReducer(state, { type: 'unknown-action' })).to.deep.equal(state);
    });
  });
});
