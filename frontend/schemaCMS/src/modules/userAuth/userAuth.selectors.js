import { createSelector } from 'reselect';
import { prop } from 'ramda';

export const selectUserAuthDomain = prop('userAuth');

export const selectUser = createSelector(
  selectUserAuthDomain,
  prop('user')
);

export const selectIsAuthenticated = createSelector(
  selectUserAuthDomain,
  prop('isAuthenticated')
);

export const selectIsFetched = createSelector(
  selectUserAuthDomain,
  prop('isUserFetched')
);
