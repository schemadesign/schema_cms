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

export const selectImageScrappingFields = createSelector(
  selectDataWranglingScriptsDomain,
  prop('imageScrappingFields')
);

export const selectCustomScripts = createSelector(
  selectDataWranglingScriptsDomain,
  prop('customScripts')
);
