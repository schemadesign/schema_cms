import { createSelector } from 'reselect';
import { prop } from 'ramda';

export const selectDataWranglingScriptsDomain = prop('dataWranglingScripts');

export const selectDataWranglingScript = createSelector(
  selectDataWranglingScriptsDomain,
  prop('script')
);

export const selectDataWranglingScripts = createSelector(
  selectDataWranglingScriptsDomain,
  prop('scripts')
);

export const selectImageScrapingFields = createSelector(
  selectDataWranglingScriptsDomain,
  prop('imageScrapingFields')
);

export const selectCustomScripts = createSelector(
  selectDataWranglingScriptsDomain,
  prop('customScripts')
);
