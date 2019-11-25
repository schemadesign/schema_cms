import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectPageDomain, selectPages, selectPage } from '../page.selectors';

describe('Page: selectors', () => {
  const state = Immutable({
    page: {
      pages: [],
      page: {},
    },
  });

  describe('selectPageDomain', () => {
    it('should select a domain', () => {
      expect(selectPageDomain(state)).to.equal(state.page);
    });
  });

  describe('selectPages', () => {
    it('should select a pages', () => {
      expect(selectPages(state)).to.equal(state.page.pages);
    });
  });

  describe('selectPage', () => {
    it('should select a page', () => {
      expect(selectPage(state)).to.equal(state.page.page);
    });
  });
});
