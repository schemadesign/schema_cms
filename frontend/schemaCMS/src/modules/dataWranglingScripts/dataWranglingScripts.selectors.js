import { createSelector } from 'reselect';
import { prop } from 'ramda';

export const selectDataWranglingScriptsDomain = prop('dataWranglingScripts');

export const selectDataWranglingScript = createSelector(
  selectDataWranglingScriptsDomain,
  prop('dataWranglingScript')
);

export const selectDataWranglingScripts = createSelector(
  selectDataWranglingScriptsDomain,
  prop('dataWranglingScripts')
);
