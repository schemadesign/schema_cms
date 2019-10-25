import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { reducer as userReducer, UserRoutines } from '../user.redux';

describe('User: redux', () => {
  const defaultState = Immutable({
    user: {},
    users: [],
  });

  describe('reducer', () => {
    it('should return initial state', () => {
      expect(userReducer(undefined, {})).to.deep.equal(defaultState);
    });

    it('should return state on unknown action', () => {
      expect(userReducer(defaultState, { type: 'unknown-action' })).to.deep.equal(defaultState);
    });

    describe('when USER/FETCH_USERS action is received', () => {
      it('should fetch user ', () => {
        const users = [{ id: 'id' }];
        const resultState = userReducer(defaultState, UserRoutines.fetchUsers.success(users));

        expect(resultState.users).to.deep.equal(users);
      });
    });

    describe('when USER/FETCH_USER action is received', () => {
      it('should fetch user ', () => {
        const user = { id: 'id' };
        const resultState = userReducer(defaultState, UserRoutines.fetchUser.success(user));

        expect(resultState.user).to.deep.equal(user);
      });
    });

    describe('when USER/MAKE_ADMIN action is received', () => {
      it('should fetch user ', () => {
        const state = Immutable({
          ...defaultState,
          user: { id: 'id' },
        });
        const user = { id: 'id', role: 'admin' };
        const resultState = userReducer(state, UserRoutines.makeAdmin.success(user));

        expect(resultState.user).to.deep.equal(user);
      });
    });

    describe('when USER/REMOVE_USER action is received', () => {
      it('should clear user ', () => {
        const state = Immutable({
          ...defaultState,
          user: { id: 'id' },
        });
        const resultState = userReducer(state, UserRoutines.removeUser.success());

        expect(resultState.user).to.deep.equal(defaultState.user);
      });
    });

    describe('when USER/UNMOUNT_USER action is received', () => {
      it('should clear user ', () => {
        const state = Immutable({
          ...defaultState,
          user: { id: 'id' },
        });
        const resultState = userReducer(state, UserRoutines.unmountUser.trigger());

        expect(resultState.user).to.deep.equal(defaultState.user);
      });
    });
  });
});
