import { createSelector } from 'reselect';
import { either, filter, isEmpty, not, pipe, prop, propEq, propOr } from 'ramda';
import { JOB_STATE_PENDING, JOB_STATE_PROCESSING } from '../job/job.constants';

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

export const selectIsAnyJobProcessing = createSelector(
  selectDataSource,
  pipe(
    propOr([], 'jobs'),
    filter(either(propEq('jobState', JOB_STATE_PENDING), propEq('jobState', JOB_STATE_PROCESSING))),
    isEmpty,
    not
  )
);
