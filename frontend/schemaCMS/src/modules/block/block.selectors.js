import { createSelector } from 'reselect';
import { prop } from 'ramda';

export const selectBlockDomain = prop('block');

export const selectBlocks = createSelector(
  selectBlockDomain,
  prop('blocks')
);
