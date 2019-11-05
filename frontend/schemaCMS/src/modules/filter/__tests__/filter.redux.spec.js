import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { reducer as filterReducer, FilterRoutines } from '../filter.redux';

describe('Filter: redux', () => {
  const state = Immutable({
    filters: [],
  });

  describe('reducer', () => {
    it('should return initial state', () => {
      expect(filterReducer(undefined, {})).to.deep.equal(state);
    });

    it('should return state on unknown action', () => {
      expect(filterReducer(state, { type: 'unknown-action' })).to.deep.equal(state);
    });
  });

  describe('when FILTERS/FETCH_LIST action is received', () => {
    it('should set filters', () => {
      const filters = [{ data: 'data' }];

      const resultState = filterReducer(state, FilterRoutines.fetchList.success(filters));
      expect(resultState.filters).to.deep.equal(filters);
    });
  });

  describe('when FILTERS/SET_FILTERS action is received', () => {
    it('should set filters', () => {
      const filters = [{ data: 'data' }];

      const resultState = filterReducer(state, FilterRoutines.setFilters.success(filters));
      expect(resultState.filters).to.deep.equal(filters);
    });
  });
});
