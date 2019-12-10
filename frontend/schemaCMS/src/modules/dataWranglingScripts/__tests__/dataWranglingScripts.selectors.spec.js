import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import {
  selectDataWranglingScripts,
  selectDataWranglingScript,
  selectDataWranglingScriptsDomain,
  selectImageScrapingFields,
  selectCustomScripts,
} from '../dataWranglingScripts.selectors';

describe('DataWranglingScripts: selectors', () => {
  const state = Immutable({
    dataWranglingScripts: {
      scripts: [],
      script: {},
      customScripts: [],
      imageScrapingFields: [],
    },
  });

  describe('selectDataWranglingScriptsDomain', () => {
    it('should select a domain', () => {
      expect(selectDataWranglingScriptsDomain(state)).to.equal(state.dataWranglingScripts);
    });

    it('should select a data wrangling scripts list', () => {
      expect(selectDataWranglingScripts(state)).to.equal(state.dataWranglingScripts.scripts);
    });

    it('should select one data wranglings script', () => {
      expect(selectDataWranglingScript(state)).to.equal(state.dataWranglingScripts.script);
    });

    it('should select image scraping fields', () => {
      expect(selectImageScrapingFields(state)).to.equal(state.dataWranglingScripts.imageScrapingFields);
    });

    it('should select custom scripts', () => {
      expect(selectCustomScripts(state)).to.equal(state.dataWranglingScripts.customScripts);
    });
  });
});
