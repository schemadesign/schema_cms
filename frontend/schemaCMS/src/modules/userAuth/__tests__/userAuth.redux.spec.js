import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { reducer as userAuthReducer, UserAuthActions } from '../userAuth.redux';

describe('UserAuth: redux', () => {
  const defaultState = Immutable({
    isAuthenticated: false,
    jwtToken: null,
  });

  describe('reducer', () => {
    it('should return initial state', () => {
      expect(userAuthReducer(undefined, {})).to.deep.equal(defaultState);
    });

    it('should return state on unknown action', () => {
      expect(userAuthReducer(defaultState, { type: 'unknown-action' })).to.deep.equal(defaultState);
    });
  });

  describe('when USER_AUTH/GET_JWT_TOKEN_SUCCESS action is received', () => {
    it('should set isAuthenticated to true', () => {
      const token = '12345';
      const resultState = userAuthReducer(defaultState, UserAuthActions.getJwtTokenSuccess(token));
      expect(resultState.isAuthenticated).to.deep.equal(true);
    });

    it('should set jwtToken value', () => {
      const token = '12345';
      const resultState = userAuthReducer(defaultState, UserAuthActions.getJwtTokenSuccess(token));
      expect(resultState.jwtToken).to.deep.equal(token);
    });
  });
});
