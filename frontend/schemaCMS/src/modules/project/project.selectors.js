import { createSelector } from 'reselect';
import { prop } from 'ramda';

export const selectProjectDomain = prop('project');

export const selectProjectsList = createSelector(
  selectProjectDomain,
  prop('projects')
);

export const selectProject = createSelector(
  selectProjectDomain,
  prop('project')
);

export const selectIsFetched = createSelector(
  selectProjectDomain,
  prop('isFetched')
);
