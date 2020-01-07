import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { DataWranglingScriptsRoutines, reducer as dataWranglingReducer } from '../dataWranglingScripts.redux';

describe('DataWranglingScripts: redux', () => {
  const defaultState = Immutable({
    script: {
      specs: {},
    },
    scripts: [],
    imageScrapingFields: [],
    customScripts: [],
  });

  describe('reducer', () => {
    it('should return initial state', () => {
      expect(dataWranglingReducer(undefined, {})).to.deep.equal(defaultState);
    });

    it('should return state on unknown action', () => {
      expect(dataWranglingReducer(defaultState, { type: 'unknown-action' })).to.deep.equal(defaultState);
    });
  });

  describe('when FETCH_ONE/SUCCESS action is received', () => {
    it('should set dataWrangling ', () => {
      const script = {
        description: 'file description',
        code: 'df.columns = map(str.lower, df.columns)',
      };
      const resultState = dataWranglingReducer(defaultState, DataWranglingScriptsRoutines.fetchOne.success(script));

      expect(resultState.script).to.deep.equal(script);
    });
  });

  describe('when FETCH_LIST/SUCCESS action is received', () => {
    it('should set dataWranglings', () => {
      const data = [{ id: 1 }];
      const dataSource = {
        activeJob: {
          scripts: [{ id: 1, execOrder: 0 }],
        },
      };

      const payload = { data, dataSource };
      const resultState = dataWranglingReducer(defaultState, DataWranglingScriptsRoutines.fetchList.success(payload));

      expect(resultState.scripts).to.deep.equal([{ ...data[0], order: 0, type: 'custom', checked: true }]);
    });
  });

  describe('when SET_IMAGE_SCRAPING_FIELDS/SUCCESS action is received', () => {
    it('should set imageScrapingFields', () => {
      const payload = {
        imageScrapingFields: ['data 1', 'data 2'],
        scriptId: 1,
      };

      const resultState = dataWranglingReducer(
        defaultState,
        DataWranglingScriptsRoutines.setImageScrapingFields.success(payload)
      );

      expect(resultState.imageScrapingFields).to.deep.equal(payload.imageScrapingFields);
    });

    it('should set customScripts', () => {
      const payload = {
        imageScrapingFields: ['data 1', 'data 2'],
        scriptId: 1,
      };

      const resultState = dataWranglingReducer(
        defaultState,
        DataWranglingScriptsRoutines.setImageScrapingFields.success(payload)
      );

      expect(resultState.customScripts).to.deep.equal([payload.scriptId]);
    });
  });

  describe('when CLEAR_CUSTOM_SCRIPTS/SUCCESS action is received', () => {
    it('should set clearCustomScripts', () => {
      const state = Immutable({
        script: {
          specs: {},
        },
        scripts: [],
        imageScrapingFields: [1],
        customScripts: [1],
      });
      const resultState = dataWranglingReducer(state, DataWranglingScriptsRoutines.clearCustomScripts.trigger());

      expect(defaultState).to.deep.equal(resultState);
    });
  });
});
