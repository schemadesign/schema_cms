import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectPageTemplatesDomain, selectPageTemplates, selectPageTemplate } from '../pageTemplates.selectors';
import { pageTemplate, pageTemplates } from '../pageTemplates.mocks';

describe('PageTemplates: selectors', () => {
  const state = Immutable({
    pageTemplates: {
      pageTemplates,
      pageTemplate,
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

  describe('selectPageTemplate', () => {
    it('should select a page template', () => {
      expect(selectPageTemplate(state)).to.equal(state.pageTemplates.pageTemplate);
    });
  });
});
