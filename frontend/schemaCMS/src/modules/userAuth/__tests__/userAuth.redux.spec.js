import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { reducer as userAuthReducer, UserAuthActions, UserAuthTypes } from '../userAuth.redux';

describe('UserAuth: redux', () => {
  const state = Immutable({});

  describe('reducer', () => {
    it('should return initial state', () => {
      expect(userAuthReducer(undefined, {})).to.deep.equal(state);
    });

    it('should return state on unknown action', () => {
      expect(userAuthReducer(state, { type: 'unknown-action' })).to.deep.equal(state);
    });
  });
});
