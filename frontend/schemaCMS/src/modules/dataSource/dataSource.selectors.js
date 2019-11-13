import { createSelector } from 'reselect';
import { prop } from 'ramda';
import { getIsAnyResultProcessing } from '../../shared/utils/helpers';

export const selectDataSourceDomain = prop('dataSource');

export const selectDataSource = createSelector(
  selectDataSourceDomain,
  prop('dataSource')
);

export const selectDataSources = createSelector(
  selectDataSourceDomain,
  prop('dataSources')
);

export const selectPreviewData = createSelector(
  selectDataSourceDomain,
  prop('previewData')
);

export const selectFieldsInfo = createSelector(
  selectDataSourceDomain,
  prop('fieldsInfo')
);

export const selectIsAnyJobProcessing = createSelector(
  selectDataSource,
  getIsAnyResultProcessing
);
