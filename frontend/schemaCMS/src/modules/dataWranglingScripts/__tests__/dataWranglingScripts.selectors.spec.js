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
      scripts: [],
      script: {},
    },
  });

  describe('selectDataWranglingScriptsDomain', () => {
    it('should select a domain', () => {
      expect(selectDataWranglingScriptsDomain(state)).to.equal(state.dataWranglingScripts);
    });

    it('should select a data wrangling scripts list', () => {
      expect(selectDataWranglingScripts(state)).to.equal(state.dataWranglingScripts.scripts);
    });

    it('should select a one data wranglings script', () => {
      expect(selectDataWranglingScript(state)).to.equal(state.dataWranglingScripts.script);
    });
  });
});
