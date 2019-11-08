import { createSelector } from 'reselect';
import { prop } from 'ramda';

export const selectJobDomain = prop('job');

export const selectJob = createSelector(
  selectJobDomain,
  prop('job')
);

export const selectJobList = createSelector(
  selectJobDomain,
  prop('jobList')
);
