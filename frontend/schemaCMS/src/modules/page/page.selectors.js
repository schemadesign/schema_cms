import { createSelector } from 'reselect';
import { prop } from 'ramda';

export const selectPageDomain = prop('page');

export const selectPages = createSelector(
  selectPageDomain,
  prop('pages')
);

export const selectPage = createSelector(
  selectPageDomain,
  prop('page')
);
