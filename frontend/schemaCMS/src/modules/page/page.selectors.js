import { createSelector } from 'reselect';
import { prop } from 'ramda';

export const selectPageDomain = prop('page');

export const selectPage = createSelector(
  selectPageDomain,
  prop('page')
);

export const selectTemporaryPageBlocks = createSelector(
  selectPageDomain,
  prop('temporaryPageBlocks')
);
