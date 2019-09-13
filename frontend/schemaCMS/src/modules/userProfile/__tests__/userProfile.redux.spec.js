import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { reducer as userProfileReducer, UserProfileActions, UserProfileRoutines } from '../userProfile.redux';

describe('UserProfile: redux', () => {
  const defaultState = Immutable({
    user: {},
    isFetched: false,
  });

  describe('reducer', () => {
    it('should return initial state', () => {
      expect(userProfileReducer(undefined, {})).to.deep.equal(defaultState);
    });

    it('should return state on unknown action', () => {
      expect(userProfileReducer(defaultState, { type: 'unknown-action' })).to.deep.equal(defaultState);
    });
  });

  describe('when USER_PROFILE/FETCH_USER_DETAILS_SUCCESS is received', () => {
    it('should set user object', async () => {
      const user = {
        pk: 1,
      };

      const resultState = userProfileReducer(defaultState, UserProfileRoutines.fetchUserDetails.success(user));
      expect(resultState.user).to.deep.equal(user);
    });

    it('should set isFetched to true', async () => {
      const user = {
        pk: 1,
      };

      const resultState = userProfileReducer(defaultState, UserProfileRoutines.fetchUserDetails.success(user));
      expect(resultState.isFetched).to.deep.equal(true);
    });
  });

  describe('when USER_PROFILE/FETCH_USER_DETAILS_ERROR is received', () => {
    it('should set user to empty object', async () => {
      const resultState = userProfileReducer(defaultState, UserProfileRoutines.fetchUserDetails.failure());
      expect(resultState.user).to.deep.equal({});
    });

    it('should set isFetched to true', async () => {
      const resultState = userProfileReducer(defaultState, UserProfileRoutines.fetchUserDetails.failure());
      expect(resultState.isFetched).to.deep.equal(true);
    });
  });

  describe('when USER_PROFILE/CLEAR_USER_DETAILS is received', () => {
    it('should set user to empty object', async () => {
      const resultState = userProfileReducer(defaultState, UserProfileActions.clearUserDetails());
      expect(resultState.user).to.deep.equal({});
    });

    it('should set isFetched to false', async () => {
      const resultState = userProfileReducer(defaultState, UserProfileActions.clearUserDetails());
      expect(resultState.isFetched).to.deep.equal(false);
    });
  });
});
