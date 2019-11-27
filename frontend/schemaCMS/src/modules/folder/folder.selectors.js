import { createSelector } from 'reselect';
import { prop } from 'ramda';

export const selectFolderDomain = prop('folder');

export const selectFolders = createSelector(
  selectFolderDomain,
  prop('folders')
);

export const selectFolder = createSelector(
  selectFolderDomain,
  prop('folder')
);
