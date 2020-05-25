import { createSelector } from 'reselect';
import { prop } from 'ramda';

export const selectMetadataDomain = prop('metadata');

export const selectMetadata = createSelector(
  selectMetadataDomain,
  prop('metadata')
);
