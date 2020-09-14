import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { reducer as configReducer, ConfigRoutines } from '../config.redux';
import { AUTH0_BACKEND } from '../config.constants';

describe('Config: redux', () => {
  const state = Immutable({
    authenticationBackend: null,
  });

  describe('reducer', () => {
    it('should return initial state', () => {
      expect(configReducer(undefined, {})).to.deep.equal(state);
    });

    it('should return state on unknown action', () => {
      expect(configReducer(state, { type: 'unknown-action' })).to.deep.equal(state);
    });

    describe('when PAGE/FETCH_PAGE action is received', () => {
      it('should set page', () => {
        const payload = { authenticationBackend: AUTH0_BACKEND };

        const resultState = configReducer(state, ConfigRoutines.fetchConfig.success(payload));
        expect(resultState.authenticationBackend).to.deep.equal(payload.authenticationBackend);
      });
    });
  });
});
