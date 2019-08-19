import { createSelector } from 'reselect';
import { prop } from 'ramda';

export const selectUserAuthDomain = prop('userAuth');

export const selectUser = createSelector(
  selectUserAuthDomain,
  state => state.get('user')
);

export const selectIsAuthenticated = createSelector(
  selectUserAuthDomain,
  prop('isAuthenticated')
);
