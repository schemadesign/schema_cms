import { createSelector } from 'reselect';
import { prop, path, defaultTo } from 'ramda';

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
  state => defaultTo([])(path(['project', 'editors'], state))
);

export const selectIsFetched = createSelector(
  selectProjectDomain,
  prop('isFetched')
);
