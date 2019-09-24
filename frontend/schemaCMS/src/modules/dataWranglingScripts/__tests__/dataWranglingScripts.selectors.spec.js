import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import {
  selectDataWranglingScripts,
  selectDataWranglingScript,
  selectDataWranglingScriptsDomain,
} from '../dataWranglingScripts.selectors';

describe('DataWranglingScripts: selectors', () => {
  const state = Immutable({
    dataWranglingScripts: {
      dataWranglingScripts: [],
      dataWranglingScript: {},
    },
  });

  describe('selectDataWranglingScriptsDomain', () => {
    it('should select a domain', () => {
      expect(selectDataWranglingScriptsDomain(state)).to.equal(state.dataWranglingScripts);
    });

    it('should select a data wranglings scripts list', () => {
      expect(selectDataWranglingScripts(state)).to.equal(state.dataWranglingScripts.dataWranglingScripts);
    });

    it('should select a one data wranglings script', () => {
      expect(selectDataWranglingScript(state)).to.equal(state.dataWranglingScripts.dataWranglingScript);
    });
  });
});
