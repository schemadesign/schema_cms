import { createSelector } from 'reselect';
import { prop } from 'ramda';

export const selectTagDomain = prop('tag');

export const selectTags = createSelector(
  selectTagDomain,
  prop('tags')
);

export const selectTag = createSelector(
  selectTagDomain,
  prop('tag')
);
