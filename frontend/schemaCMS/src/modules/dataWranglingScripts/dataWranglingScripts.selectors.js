import { createSelector } from 'reselect';
import { prop } from 'ramda';

export const selectDataWranglingDomain = prop('dataWranglingScripts');

export const selectDataWrangling = createSelector(
  selectDataWranglingDomain,
  prop('dataWrangling')
);

export const selectDataWranglings = createSelector(
  selectDataWranglingDomain,
  prop('dataWranglings')
);
