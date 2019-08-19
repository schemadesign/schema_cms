import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectAppConfigDomain } from '../appConfig.selectors';

describe('AppConfig: selectors', () => {
  const state = Immutable({
    appConfig: {},
  });

  describe('selectAppConfigDomain', () => {
    it('should select a domain', () => {
      expect(selectAppConfigDomain(state)).to.equal(state.appConfig);
    });
  });
});
