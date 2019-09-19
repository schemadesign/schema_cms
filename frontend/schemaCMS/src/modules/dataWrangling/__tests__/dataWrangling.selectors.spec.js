import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectDataWranglingDomain, selectDataWrangling } from '../dataWrangling.selectors';

describe('DataWrangling: selectors', () => {
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

    it('should select a dataWrangling', () => {
      expect(selectDataWrangling(state)).to.equal(state.dataWrangling.dataWrangling);
    });
  });
});
