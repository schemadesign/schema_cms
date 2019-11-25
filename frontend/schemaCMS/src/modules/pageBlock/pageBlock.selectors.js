import { createSelector } from 'reselect';
import { prop } from 'ramda';

export const selectPageBlockDomain = prop('pageBlock');

export const selectPageBlocks = createSelector(
  selectPageBlockDomain,
  prop('pageBlocks')
);
