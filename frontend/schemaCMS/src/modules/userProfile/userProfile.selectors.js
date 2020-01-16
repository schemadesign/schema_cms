import { createSelector } from 'reselect';
import { prop, path } from 'ramda';

export const selectUserProfileDomain = prop('userProfile');

export const selectIsFetched = createSelector(
  selectUserProfileDomain,
  prop('isFetched')
);

export const selectUserData = createSelector(
  selectUserProfileDomain,
  prop('user')
);

export const selectDataWranglingDetail = createSelector(
  selectUserProfileDomain,
  prop('dataWranglingDetail')
);

export const selectIsAdmin = createSelector(
  selectUserProfileDomain,
  prop('isAdmin')
);

export const selectUserRole = createSelector(
  selectUserProfileDomain,
  path(['user', 'role'])
);

export const selectUserId = createSelector(
  selectUserProfileDomain,
  path(['user', 'id'])
);
