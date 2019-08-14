import { createSelector } from 'reselect';
import { prop } from 'ramda';

export const selectUserAuthDomain = prop('userAuth');
