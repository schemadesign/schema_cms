import { createSelector } from 'reselect';
import { prop } from 'ramda';

export const selectPageDomain = prop('page');

export const selectPage = createSelector(
  selectPageDomain,
  prop('page')
);

export const selectPageAdditonalData = createSelector(
  selectPageDomain,
  prop('pageAdditionalData')
);
