import { createSelector } from 'reselect';
import { prop } from 'ramda';

export const selectDirectoryDomain = prop('directory');

export const selectDirectories = createSelector(
  selectDirectoryDomain,
  prop('directories')
);

export const selectDirectory = createSelector(
  selectDirectoryDomain,
  prop('directory')
);