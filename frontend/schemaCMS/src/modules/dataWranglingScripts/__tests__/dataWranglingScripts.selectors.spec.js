import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import {
  selectDataWranglings,
  selectDataWrangling,
  selectDataWranglingDomain,
} from '../dataWranglingScripts.selectors';

describe('DataWranglingScripts: selectors', () => {
  const state = Immutable({
    dataWranglingScripts: {
      dataWranglingScripts: [],
      dataWranglingScript: {},
    },
  });

  describe('selectDataWranglingDomain', () => {
    it('should select a domain', () => {
      expect(selectDataWranglingDomain(state)).to.equal(state.dataWranglingScripts);
    });

    it('should select a data wranglings scripts list', () => {
      expect(selectDataWranglings(state)).to.equal(state.dataWranglingScripts.dataWranglingScripts);
    });

    it('should select a ona data wranglingscript', () => {
      expect(selectDataWrangling(state)).to.equal(state.dataWranglingScripts.dataWranglingScript);
    });
  });
});
