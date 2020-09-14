import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectConfigDomain } from '../config.selectors';

describe('Config: selectors', () => {
  const state = Immutable({
    config: {},
  });

  describe('selectConfigDomain', () => {
    it('should select a domain', () => {
      expect(selectConfigDomain(state)).to.equal(state.config);
    });
  });
});
