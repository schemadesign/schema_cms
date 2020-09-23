import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectConfigDomain, selectBackend, selectIsOktaBackend, selectIsAuth0Backend } from '../config.selectors';
import { AUTH0_BACKEND, OKTA_BACKEND } from '../config.constants';

describe('Config: selectors', () => {
  const state = Immutable({
    config: {
      authenticationBackend: null,
    },
  });

  describe('selectConfigDomain', () => {
    it('should select a domain', () => {
      expect(selectConfigDomain(state)).to.equal(state.config);
    });
  });

  describe('selectBackend', () => {
    it('should select the backend', () => {
      expect(selectBackend(state)).to.equal(state.config.authenticationBackend);
    });
  });

  describe('selectIsOktaBackend', () => {
    it('should select a if is okta backend', () => {
      const oktaState = Immutable({
        config: {
          authenticationBackend: OKTA_BACKEND,
        },
      });

      expect(selectIsOktaBackend(oktaState)).to.equal(true);
      expect(selectIsOktaBackend(state)).to.equal(false);
    });
  });

  describe('selectIsAuth0Backend', () => {
    it('should select a if is auth backend', () => {
      const auth0State = Immutable({
        config: {
          authenticationBackend: AUTH0_BACKEND,
        },
      });

      expect(selectIsAuth0Backend(auth0State)).to.equal(true);
      expect(selectIsAuth0Backend(state)).to.equal(false);
    });
  });
});
