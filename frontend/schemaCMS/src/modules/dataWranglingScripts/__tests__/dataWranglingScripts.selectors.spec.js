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
      dataWranglings: [],
      dataWrangling: {},
    },
  });

  describe('selectDataWranglingDomain', () => {
    it('should select a domain', () => {
      expect(selectDataWranglingDomain(state)).to.equal(state.dataWranglingScripts);
    });

    it('should select a data wranglings', () => {
      expect(selectDataWranglings(state)).to.equal(state.dataWranglingScripts.dataWranglings);
    });

    it('should select a dataWrangling', () => {
      expect(selectDataWrangling(state)).to.equal(state.dataWranglingScripts.dataWrangling);
    });
  });
});
