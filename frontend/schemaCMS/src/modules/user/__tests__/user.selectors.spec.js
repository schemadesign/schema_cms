import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectUserDomain } from '../user.selectors';

describe('User: selectors', () => {
  const state = Immutable({
    user: {},
  });

  describe('selectUserDomain', () => {
    it('should select a domain', () => {
      expect(selectUserDomain(state)).to.equal(state.user);
    });
  });
});
