import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { reducer as pageReducer, PageRoutines } from '../page.redux';

describe('Page: redux', () => {
  const state = Immutable({
    pages: [],
  });

  describe('reducer', () => {
    it('should return initial state', () => {
      expect(pageReducer(undefined, {})).to.deep.equal(state);
    });

    it('should return state on unknown action', () => {
      expect(pageReducer(state, { type: 'unknown-action' })).to.deep.equal(state);
    });
  });

  describe('when FILTERS/FETCH_LIST action is received', () => {
    it('should set filters', () => {
      const pages = [{ data: 'data' }];

      const resultState = pageReducer(state, PageRoutines.fetchList.success(pages));
      expect(resultState.pages).to.deep.equal(pages);
    });
  });
});
