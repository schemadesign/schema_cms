import { createSelector } from 'reselect';
import { prop } from 'ramda';

export const selectDataSourceDomain = prop('dataSource');

export const selectDataSource = createSelector(
  selectDataSourceDomain,
  prop('dataSource')
);

export const selectDataSources = createSelector(
  selectDataSourceDomain,
  prop('dataSources')
);

export const selectFields = createSelector(
  selectDataSourceDomain,
  prop('fields')
);

export const selectPreviewTable = createSelector(
  selectDataSourceDomain,
  prop('previewTable')
);
