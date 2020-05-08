import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { reducer as tagCategoryReducer, TagCategoryRoutines } from '../tagCategory.redux';

describe('Tag Category: redux', () => {
  const state = Immutable({
    tagCategories: [],
    tagCategory: {},
  });

  describe('reducer', () => {
    it('should return initial state', () => {
      expect(tagCategoryReducer(undefined, {})).to.deep.equal(state);
    });

    it('should return state on unknown action', () => {
      expect(tagCategoryReducer(state, { type: 'unknown-action' })).to.deep.equal(state);
    });
  });

  describe('when TAG/FETCH_LIST action is received', () => {
    it('should set tags', () => {
      const tagCategories = [{ data: 'data' }];

      const resultState = tagCategoryReducer(state, TagCategoryRoutines.fetchTagCategories.success(tagCategories));
      expect(resultState.tagCategories).to.deep.equal(tagCategories);
    });
  });

  describe('when TAG/FETCH_TAG action is received', () => {
    it('should set tags', () => {
      const tagCategory = { data: 'data' };

      const resultState = tagCategoryReducer(state, TagCategoryRoutines.fetchTagCategory.success(tagCategory));
      expect(resultState.tagCategory).to.deep.equal(tagCategory);
    });
  });
});
