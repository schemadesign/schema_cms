import { createSelector } from 'reselect';
import { prop } from 'ramda';

export const selectUserDomain = prop('user');
