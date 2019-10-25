import { createSelector } from 'reselect';
import { prop, propEq } from 'ramda';
import { ROLES } from './userProfile.constants';

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
  selectUserData,
  propEq('role', ROLES.ADMIN)
);
