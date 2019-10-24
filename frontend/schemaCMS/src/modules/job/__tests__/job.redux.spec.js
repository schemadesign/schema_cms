import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { reducer as jobReducer } from '../job.redux';

describe('Job: redux', () => {
  const state = Immutable({});

  describe('reducer', () => {
    it('should return initial state', () => {
      expect(jobReducer(undefined, {})).to.deep.equal(state);
    });

    it('should return state on unknown action', () => {
      expect(jobReducer(state, { type: 'unknown-action' })).to.deep.equal(state);
    });
  });
});
