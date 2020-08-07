import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { reducer as pageReducer, PageRoutines } from '../page.redux';

describe('Page: redux', () => {
  const state = Immutable({
    page: { description: '', displayName: '', isPublic: false, keywords: '', name: '', template: '' },
    pageAdditionalData: {
      internalConnections: [],
      tagCategories: [],
      states: [],
      pageTemplates: [],
    },
  });

  describe('reducer', () => {
    it('should return initial state', () => {
      expect(pageReducer(undefined, {})).to.deep.equal(state);
    });

    it('should return state on unknown action', () => {
      expect(pageReducer(state, { type: 'unknown-action' })).to.deep.equal(state);
    });
  });

  describe('when PAGE/FETCH_PAGE action is received', () => {
    it('should set page', () => {
      const page = { data: 'data' };

      const resultState = pageReducer(state, PageRoutines.fetchPage.success(page));
      expect(resultState.page).to.deep.equal(page);
    });
  });

  describe('when PAGE/UPDATE_PAGE success action is received', () => {
    it('should set page', () => {
      const page = { data: 'data' };

      const resultState = pageReducer(state, PageRoutines.updatePage.success(page));
      expect(resultState.page).to.deep.equal(page);
    });
  });

  describe('when PAGE/PUBLISH_PAGE success action is received', () => {
    it('should set page', () => {
      const page = { data: 'data' };

      const resultState = pageReducer(state, PageRoutines.publishPage.success(page));
      expect(resultState.page).to.deep.equal(page);
    });
  });

  describe('when PAGE/FETCH_PAGE_ADDITIONAL_DATA success action is received', () => {
    it('should set page additional data', () => {
      const pageAdditionalData = { data: 'data' };

      const resultState = pageReducer(state, PageRoutines.fetchPageAdditionalData.success(pageAdditionalData));
      expect(resultState.pageAdditionalData).to.deep.equal(pageAdditionalData);
    });
  });
});
