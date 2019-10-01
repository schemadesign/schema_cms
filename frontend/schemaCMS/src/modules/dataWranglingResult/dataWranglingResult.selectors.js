import { createSelector } from 'reselect';
import { prop } from 'ramda';

export const selectDataWranglingResultDomain = prop('dataWranglingResult');

export const selectFields = createSelector(
  selectDataWranglingResultDomain,
  prop('fields')
);

export const selectPreviewTable = createSelector(
  selectDataWranglingResultDomain,
  prop('previewTable')
);
