import { createSelector } from 'reselect';
import { prop } from 'ramda';

export const selectProjectStateDomain = prop('projectState');

export const selectStates = createSelector(selectProjectStateDomain, prop('states'));

export const selectState = createSelector(selectProjectStateDomain, prop('state'));
