import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectUserDomain, selectUser, selectUsers } from '../user.selectors';

describe('User: selectors', () => {
  const state = Immutable({
    user: {},
    users: [],
  });

  describe('selectUserDomain', () => {
    it('should select a domain', () => {
      expect(selectUserDomain(state)).to.equal(state.user);
    });
  });

  describe('selectUser', () => {
    it('should select a user', () => {
      expect(selectUser(state)).to.equal(state.user.user);
    });
  });

  describe('selectUsers', () => {
    it('should select a users', () => {
      expect(selectUsers(state)).to.equal(state.user.users);
    });
  });
});
