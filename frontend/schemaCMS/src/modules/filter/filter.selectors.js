import { createSelector } from 'reselect';
import { prop } from 'ramda';

export const selectFilterDomain = prop('filter');

export const selectFilters = createSelector(
  selectFilterDomain,
  prop('filters')
);

export const selectFilter = createSelector(
  selectFilterDomain,
  prop('filter')
);
