import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { reducer as pageTemplatesReducer, PageTemplatesRoutines } from '../pageTemplates.redux';

describe('PageTemplates: redux', () => {
  const state = Immutable({ pageTemplate: {}, pageTemplates: [] });

  describe('reducer', () => {
    it('should return initial state', () => {
      expect(pageTemplatesReducer(undefined, {})).to.deep.equal(state);
    });

    it('should return state on unknown action', () => {
      expect(pageTemplatesReducer(state, { type: 'unknown-action' })).to.deep.equal(state);
    });
  });

  describe('when PAGE_TEMPLATES/FETCH_PAGE_TEMPLATES_SUCCESS action is received', () => {
    it('should set page templates', () => {
      const pageTemplates = [{ data: 'data' }];
      const resultState = pageTemplatesReducer(state, PageTemplatesRoutines.fetchPageTemplates.success(pageTemplates));

      expect(resultState.pageTemplates).to.deep.equal(pageTemplates);
    });
  });

  describe('when PAGE_TEMPLATES/FETCH_PAGE_TEMPLATE_SUCCESS action is received', () => {
    it('should set page templates', () => {
      const pageTemplate = { data: 'data' };
      const resultState = pageTemplatesReducer(state, PageTemplatesRoutines.fetchPageTemplate.success(pageTemplate));

      expect(resultState.pageTemplate).to.deep.equal(pageTemplate);
    });
  });
});
