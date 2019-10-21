import { createSelector } from 'reselect';
import { prop, pathOr } from 'ramda';

export const selectProjectDomain = prop('project');

export const selectProjectsList = createSelector(
  selectProjectDomain,
  prop('projects')
);

export const selectProject = createSelector(
  selectProjectDomain,
  prop('project')
);

export const selectProjectUsers = createSelector(
  selectProjectDomain,
  pathOr([], ['project', 'editors'])
);

export const selectIsFetched = createSelector(
  selectProjectDomain,
  prop('isFetched')
);
