import { createSelector } from 'reselect';
import { prop, filter, propEq, propOr, pipe } from 'ramda';
import { ROLES, ROLE } from '../userProfile/userProfile.constants';

export const selectUserDomain = prop('user');

export const selectUser = createSelector(
  selectUserDomain,
  prop('user')
);

export const selectUsers = createSelector(
  selectUserDomain,
  prop('users')
);

export const selectEditorUsers = createSelector(
  selectUserDomain,
  pipe(
    propOr([], 'users'),
    filter(propEq(ROLE, ROLES.EDITOR))
  )
);
