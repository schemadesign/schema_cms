import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectFilterDomain } from '../filter.selectors';

describe('Filter: selectors', () => {
  const state = Immutable({
    filter: {},
  });

  describe('selectFilterDomain', () => {
    it('should select a domain', () => {
      expect(selectFilterDomain(state)).to.equal(state.filter);
    });
  });
});
