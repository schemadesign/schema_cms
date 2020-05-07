import { createSelector } from 'reselect';
import { prop } from 'ramda';

export const selectProjectTagDomain = prop('projectTag');

export const selectTags = createSelector(
  selectProjectTagDomain,
  prop('tags')
);

export const selectTag = createSelector(
  selectProjectTagDomain,
  prop('tag')
);
