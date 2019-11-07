import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectFilterDomain, selectFilters, selectFilter } from '../filter.selectors';

describe('Filter: selectors', () => {
  const state = Immutable({
    filter: {
      filters: [],
      filter: {},
    },
  });

  describe('selectFilterDomain', () => {
    it('should select a domain', () => {
      expect(selectFilterDomain(state)).to.equal(state.filter);
    });
  });

  describe('selectFilters', () => {
    it('should select a filters', () => {
      expect(selectFilters(state)).to.equal(state.filter.filters);
    });
  });

  describe('selectFilter', () => {
    it('should select a filter', () => {
      expect(selectFilter(state)).to.equal(state.filter.filter);
    });
  });
});
