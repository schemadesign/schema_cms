import { createSelector } from 'reselect';
import { prop } from 'ramda';

export const selectUserDomain = prop('user');

export const selectUser = createSelector(
  selectUserDomain,
  prop('user')
);

export const selectUsers = createSelector(
  selectUserDomain,
  prop('users')
);
