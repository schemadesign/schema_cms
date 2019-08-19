import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { reducer as appConfigReducer, AppConfigActions, AppConfigTypes } from '../appConfig.redux';

describe('AppConfig: redux', () => {
  const state = Immutable({});

  describe('reducer', () => {
    it('should return initial state', () => {
      expect(appConfigReducer(undefined, {})).to.deep.equal(state);
    });

    it('should return state on unknown action', () => {
      expect(appConfigReducer(state, { type: 'unknown-action' })).to.deep.equal(state);
    });
  });
});
