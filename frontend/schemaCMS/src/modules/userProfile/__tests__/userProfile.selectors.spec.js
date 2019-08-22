import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectUserProfileDomain } from '../userProfile.selectors';

describe('UserProfile: selectors', () => {
  const state = Immutable({
    userProfile: {},
  });

  describe('selectUserProfileDomain', () => {
    it('should select a domain', () => {
      expect(selectUserProfileDomain(state)).to.equal(state.userProfile);
    });
  });
});
