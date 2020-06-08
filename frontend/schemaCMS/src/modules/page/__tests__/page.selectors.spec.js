import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectPageDomain, selectPage, selectPageAdditonalData } from '../page.selectors';

describe('Page: selectors', () => {
  const state = Immutable({
    page: {
      page: {},
      temporaryPageBlocks: [],
    },
    pageAdditionalData: {
      internalConnections: [],
      tagCategories: [],
      states: [],
      pageTemplates: [],
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

  describe('selectPageAdditonalData', () => {
    it('should select a page additional data', () => {
      expect(selectPageAdditonalData(state)).to.equal(state.page.pageAdditionalData);
    });
  });
});
