import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectUserProfileDomain, selectIsFetched } from '../userProfile.selectors';

describe('UserProfile: selectors', () => {
  const state = Immutable({
    userProfile: {
      isFetched: false,
    },
  });

  describe('selectUserProfileDomain', () => {
    it('should select a domain', () => {
      expect(selectUserProfileDomain(state)).to.equal(state.userProfile);
    });

    it('should select if user is fetched', () => {
      expect(selectIsFetched(state)).to.equal(state.userProfile.isFetched);
    });
  });
});
