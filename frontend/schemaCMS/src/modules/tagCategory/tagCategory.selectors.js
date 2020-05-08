import { createSelector } from 'reselect';
import { prop } from 'ramda';

export const selectTagCategoryDomain = prop('tagCategory');

export const selectTagCategories = createSelector(
  selectTagCategoryDomain,
  prop('tagCategories')
);

export const selectTagCategory = createSelector(
  selectTagCategoryDomain,
  prop('tagCategory')
);
