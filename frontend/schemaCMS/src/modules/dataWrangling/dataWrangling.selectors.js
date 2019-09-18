import { createSelector } from 'reselect';
import { prop } from 'ramda';

export const selectDataWranglingDomain = prop('dataWrangling');

export const selectDataWranglings = createSelector(
  selectDataWranglingDomain,
  prop('dataWranglings')
);
