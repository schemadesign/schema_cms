import { createSelector } from 'reselect';
import { prop, equals } from 'ramda';

import { OKTA_BACKEND, AUTH0_BACKEND } from './config.constants';

export const selectConfigDomain = prop('config');

export const selectBackend = createSelector(
  selectConfigDomain,
  prop('authenticationBackend')
);

export const selectIsAuth0Backend = createSelector(
  selectBackend,
  equals(AUTH0_BACKEND)
);

export const selectIsOktaBackend = createSelector(
  selectBackend,
  equals(OKTA_BACKEND)
);
