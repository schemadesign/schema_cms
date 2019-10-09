import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { reducer as userReducer, UserActions, UserTypes } from '../user.redux';

describe('User: redux', () => {
  const state = Immutable({});

  describe('reducer', () => {
    it('should return initial state', () => {
      expect(userReducer(undefined, {})).to.deep.equal(state);
    });

    it('should return state on unknown action', () => {
      expect(userReducer(state, { type: 'unknown-action' })).to.deep.equal(state);
    });
  });
});
