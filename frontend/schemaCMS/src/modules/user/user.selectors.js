import { createSelector } from 'reselect';
import { filter, pipe, prop, propEq, propOr } from 'ramda';
import { ROLE, ROLES } from '../userProfile/userProfile.constants';

export const selectUserDomain = prop('user');

export const selectUser = createSelector(selectUserDomain, prop('user'));

export const selectUsers = createSelector(selectUserDomain, prop('users'));

export const selectEditorUsers = createSelector(
  selectUserDomain,
  pipe(propOr([], 'users'), filter(propEq(ROLE, ROLES.EDITOR)))
);
