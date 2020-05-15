import { createSelector } from 'reselect';
import { prop } from 'ramda';

export const selectDataSourceTagsDomain = prop('dataSourceTags');

export const selectDataSourceTags = createSelector(
  selectDataSourceTagsDomain,
  prop('dataSourceTags')
);
