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

export const selectEditors = createSelector(
  selectProjectDomain,
  prop('editors')
);

export const selectProjectTitle = createSelector(
  selectProject,
  prop('title')
);

export const selectTemplates = createSelector(
  selectProjectDomain,
  prop('templates')
);
