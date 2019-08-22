import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { reducer as userProfileReducer, UserProfileActions, UserProfileTypes } from '../userProfile.redux';

describe('UserProfile: redux', () => {
  const state = Immutable({});

  describe('reducer', () => {
    it('should return initial state', () => {
      expect(userProfileReducer(undefined, {})).to.deep.equal(state);
    });

    it('should return state on unknown action', () => {
      expect(userProfileReducer(state, { type: 'unknown-action' })).to.deep.equal(state);
    });
  });
});
