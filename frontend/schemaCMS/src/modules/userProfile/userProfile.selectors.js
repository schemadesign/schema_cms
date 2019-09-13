import { createSelector } from 'reselect';
import { prop } from 'ramda';

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

