import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectUserAuthDomain } from '../userAuth.selectors';

describe('UserAuth: selectors', () => {
  const state = Immutable({
    userAuth: {},
  });

  describe('selectUserAuthDomain', () => {
    it('should select a domain', () => {
      expect(selectUserAuthDomain(state)).to.equal(state.userAuth);
    });
  });
});
