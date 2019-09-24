import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import {
  selectDataWranglings,
  selectDataWrangling,
  selectDataWranglingDomain,
} from '../dataWranglingScripts.selectors';

describe('DataWranglingScripts: selectors', () => {
  const state = Immutable({
    dataWrangling: {
      dataWranglings: [],
      dataWrangling: {},
    },
  });

  describe('selectDataWranglingDomain', () => {
    it('should select a domain', () => {
      expect(selectDataWranglingDomain(state)).to.equal(state.dataWrangling);
    });

    it('should select a data wranglings', () => {
      expect(selectDataWranglings(state)).to.equal(state.dataWrangling.dataWranglings);
    });

    it('should select a dataWrangling', () => {
      expect(selectDataWrangling(state)).to.equal(state.dataWrangling.dataWrangling);
    });
  });
});
