import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectUserAuthDomain, selectAuthToken, selectIsAuthenticated } from '../userAuth.selectors';

describe('UserAuth: selectors', () => {
  const state = Immutable({
    userAuth: {
      isAuthenticated: false,
      jwtToken: null,
    },
  });

  describe('selectUserAuthDomain', () => {
    it('should select a domain', () => {
      expect(selectUserAuthDomain(state)).to.equal(state.userAuth);
    });

    it('should select a auth token', () => {
      expect(selectAuthToken(state)).to.equal(state.userAuth.jwtToken);
    });

    it('should select if user is authenticated', () => {
      expect(selectIsAuthenticated(state)).to.equal(state.userAuth.isAuthenticated);
    });
  });
});
