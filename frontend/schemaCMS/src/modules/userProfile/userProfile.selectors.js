import { createSelector } from 'reselect';
import { prop } from 'ramda';

export const selectUserProfileDomain = prop('userProfile');

export const selectIsFetched = createSelector(
  selectUserProfileDomain,
  prop('isFetched')
);
