import { createSelector } from 'reselect';
import { prop, pathOr } from 'ramda';

export const selectDirectoryDomain = prop('directory');

export const selectDirectories = createSelector(
  selectDirectoryDomain,
  prop('directories')
);

export const selectDirectory = createSelector(
  selectDirectoryDomain,
  prop('directory')
);

export const selectDirectoryName = createSelector(
  selectDirectoryDomain,
  pathOr('', ['directory', 'name'])
);
