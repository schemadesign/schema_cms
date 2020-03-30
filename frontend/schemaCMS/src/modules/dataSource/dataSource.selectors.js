import { createSelector } from 'reselect';
import { pathOr, prop } from 'ramda';

export const selectDataSourceDomain = prop('dataSource');

export const selectDataSource = createSelector(selectDataSourceDomain, prop('dataSource'));

export const selectDataSources = createSelector(selectDataSourceDomain, prop('dataSources'));

export const selectPreviewData = createSelector(selectDataSourceDomain, prop('previewData'));

export const selectFieldsInfo = createSelector(selectDataSourceDomain, prop('fieldsInfo'));

export const selectUploadingDataSources = createSelector(selectDataSourceDomain, prop('uploadingDataSources'));

export const selectFieldsWithUrls = createSelector(
  selectDataSourceDomain,
  pathOr([], ['dataSource', 'metaData', 'fieldsWithUrls'])
);
