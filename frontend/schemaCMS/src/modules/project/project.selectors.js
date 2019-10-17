import { createSelector } from 'reselect';
import { prop, path } from 'ramda';

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
  path(['project', 'editors'])
);

export const selectIsFetched = createSelector(
  selectProjectDomain,
  prop('isFetched')
);

export const selectNotInProjectUsers = createSelector(
  selectProjectDomain,
  prop('notInProjectUsers')
);
