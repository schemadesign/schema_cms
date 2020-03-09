import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectPageTemplatesDomain, selectPageTemplates } from '../pageTemplates.selectors';
import { pageTemplates } from '../pageTemplates.mocks';

describe('PageTemplates: selectors', () => {
  const state = Immutable({
    pageTemplates: {
      pageTemplates,
    },
  });

  describe('selectPageTemplatesDomain', () => {
    it('should select a domain', () => {
      expect(selectPageTemplatesDomain(state)).to.equal(state.pageTemplates);
    });
  });

  describe('selectPageTemplates', () => {
    it('should select a page templates', () => {
      expect(selectPageTemplates(state)).to.equal(state.pageTemplates.pageTemplates);
    });
  });
});
