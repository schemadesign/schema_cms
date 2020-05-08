import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectTagCategoryDomain, selectTagCategories, selectTagCategory } from '../tagCategory.selectors';

describe('TagCategory: selectors', () => {
  const state = Immutable({
    tagCategory: {
      tagCategories: [],
      tagCategory: {},
    },
  });

  describe('selectTagCategoryDomain', () => {
    it('should select a domain', () => {
      expect(selectTagCategoryDomain(state)).to.equal(state.tagCategory);
    });
  });

  describe('selectTagCategories', () => {
    it('should select a tag categories', () => {
      expect(selectTagCategories(state)).to.equal(state.tagCategory.tagCategories);
    });
  });

  describe('selectTagCategory', () => {
    it('should select a tag category', () => {
      expect(selectTagCategory(state)).to.equal(state.tagCategory.tagCategory);
    });
  });
});
