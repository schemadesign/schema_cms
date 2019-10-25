import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectUserDomain, selectUser, selectUsers, selectEditorUsers } from '../user.selectors';

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

  describe('selectEditorUsers', () => {
    it('should select empty users', () => {
      expect(selectEditorUsers(state)).to.deep.equal([]);
    });

    it('should select editor users', () => {
      const users = [
        { firstName: 'John', lastName: 'Doe', role: 'admin' },
        { firstName: 'Alan', lastName: 'Watts', role: 'editor' },
      ];

      const stateWithUsers = {
        user: { ...state.user, users },
      };

      const expectedState = { ...state.user, users: [{ firstName: 'Alan', lastName: 'Watts', role: 'editor' }] };

      expect(selectEditorUsers(stateWithUsers)).to.deep.equal(expectedState.users);
    });
  });
});
