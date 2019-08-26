import { createSelector } from 'reselect';
import { prop } from 'ramda';

export const selectUserAuthDomain = prop('userAuth');

export const selectIsAuthenticated = createSelector(
  selectUserAuthDomain,
  prop('isAuthenticated')
);

export const selectAuthToken = createSelector(
  selectUserAuthDomain,
  prop('jwtToken')
);
