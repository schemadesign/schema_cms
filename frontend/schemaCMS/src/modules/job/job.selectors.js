import { createSelector } from 'reselect';
import { prop } from 'ramda';
import { getIsAnyResultSuccess } from '../../shared/utils/helpers';

export const selectJobDomain = prop('job');

export const selectJob = createSelector(
  selectJobDomain,
  prop('job')
);

export const selectJobPreview = createSelector(
  selectJobDomain,
  prop('jobPreview')
);

export const selectJobList = createSelector(
  selectJobDomain,
  prop('jobList')
);

export const selectIsAnyJobSuccessful = createSelector(
  selectJobList,
  getIsAnyResultSuccess
);
