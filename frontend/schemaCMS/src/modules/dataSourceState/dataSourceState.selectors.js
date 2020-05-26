import { createSelector } from 'reselect';
import { prop } from 'ramda';

export const selectDataSourceStateDomain = prop('dataSourceState');

export const selectStates = createSelector(
  selectDataSourceStateDomain,
  prop('states')
);

export const selectState = createSelector(
  selectDataSourceStateDomain,
  prop('state')
);
