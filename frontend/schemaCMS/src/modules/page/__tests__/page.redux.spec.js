import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { reducer as pageReducer, PageRoutines } from '../page.redux';

describe('Page: redux', () => {
  const state = Immutable({
    pages: [],
    page: {},
  });

  describe('reducer', () => {
    it('should return initial state', () => {
      expect(pageReducer(undefined, {})).to.deep.equal(state);
    });

    it('should return state on unknown action', () => {
      expect(pageReducer(state, { type: 'unknown-action' })).to.deep.equal(state);
    });
  });

  describe('when PAGE/FETCH_LIST success action is received', () => {
    it('should set filters', () => {
      const pages = [{ data: 'data' }];

      const resultState = pageReducer(state, PageRoutines.fetchList.success(pages));
      expect(resultState.pages).to.deep.equal(pages);
    });
  });

  describe('when PAGE/CREATE success action is received', () => {
    it('should set filters', () => {
      const page = { data: 'data' };

      const resultState = pageReducer(state, PageRoutines.create.success(page));
      expect(resultState.page).to.deep.equal(page);
    });
  });
});
