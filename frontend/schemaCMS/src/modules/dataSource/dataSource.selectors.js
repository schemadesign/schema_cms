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

export const selectFields = createSelector(
  selectDataSourceDomain,
  prop('fields')
);

export const selectPreviewTable = createSelector(
  selectDataSourceDomain,
  prop('previewTable')
);

export const selectFieldsInfo = createSelector(
  selectDataSourceDomain,
  prop('fieldsInfo')
);

export const selectIsAnyJobProcessing = createSelector(
  selectDataSource,
  getIsAnyResultProcessing
);

export const selectJobPreview = createSelector(
  selectDataSourceDomain,
  prop('jobPreview')
);
