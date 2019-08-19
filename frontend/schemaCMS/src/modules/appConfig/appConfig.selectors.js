import { createSelector } from 'reselect';
import { prop } from 'ramda';

export const selectAppConfigDomain = prop('appConfig');
