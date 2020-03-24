import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectPageDomain, selectPage, selectTemporaryPageBlocks } from '../page.selectors';

describe('Page: selectors', () => {
  const state = Immutable({
    page: {
      page: {},
      temporaryPageBlocks: [],
    },
  });

  describe('selectPageDomain', () => {
    it('should select a domain', () => {
      expect(selectPageDomain(state)).to.equal(state.page);
    });
  });

  describe('selectPage', () => {
    it('should select a page', () => {
      expect(selectPage(state)).to.equal(state.page.page);
    });
  });

  describe('selectTemporaryPageBlocks', () => {
    it('should select a temporaryPageBlocks', () => {
      expect(selectTemporaryPageBlocks(state)).to.equal(state.page.temporaryPageBlocks);
    });
  });
});
