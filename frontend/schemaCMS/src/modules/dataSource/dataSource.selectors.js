import { createSelector } from 'reselect';
import { prop } from 'ramda';

export const selectDataSourceDomain = prop('dataSource');

export const selectDataSource = createSelector(
  selectDataSourceDomain,
  prop('dataSource')
);
