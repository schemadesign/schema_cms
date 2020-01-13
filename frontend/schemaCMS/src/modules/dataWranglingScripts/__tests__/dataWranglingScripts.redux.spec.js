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
      expect(dataWranglingReducer(undefined, {})).toEqual(defaultState);
    });

    it('should return state on unknown action', () => {
      expect(dataWranglingReducer(defaultState, { type: 'unknown-action' })).toEqual(defaultState);
    });
  });

  describe('when FETCH_ONE/SUCCESS action is received', () => {
    it('should set dataWrangling ', () => {
      const script = {
        description: 'file description',
        code: 'df.columns = map(str.lower, df.columns)',
      };
      const resultState = dataWranglingReducer(defaultState, DataWranglingScriptsRoutines.fetchOne.success(script));

      expect(resultState.script).toEqual(script);
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

      expect(resultState.scripts).toEqual([{ ...data[0], order: 0, type: 1, checked: true }]);
    });
  });

  describe('when FETCH_LIST/SUCCESS action is received with existed scripts', () => {
    it('should set dataWranglings', () => {
      const data = [{ id: 1, type: 0 }, { id: 2, type: 1, checked: true }, { id: 3 }];
      const dataSource = {
        activeJob: {
          scripts: [{ id: 2, execOrder: 0 }],
        },
      };
      const payload = { data, dataSource };
      const stateWithScripts = defaultState
        .setIn(['scripts', 0], { id: 1, type: 0 })
        .setIn(['scripts', 1], { id: 2, type: 1 });
      const resultState = dataWranglingReducer(
        stateWithScripts,
        DataWranglingScriptsRoutines.fetchList.success(payload)
      );

      expect(resultState.scripts).toEqual([
        { id: 2, type: 1, checked: true, order: 0 },
        { id: 1, type: 1, order: Number.MAX_SAFE_INTEGER },
        { id: 3, type: 1, order: Number.MAX_SAFE_INTEGER },
      ]);
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

      expect(resultState.imageScrapingFields).toEqual(payload.imageScrapingFields);
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

      expect(resultState.customScripts).toEqual([payload.scriptId]);
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

      expect(defaultState).toEqual(resultState);
    });
  });

  describe('when SET_SCRIPTS/SUCCESS action is received', () => {
    it('should set dataWrangling ', () => {
      const scripts = [{ id: 3, type: 1 }, { id: 1, type: 1 }, { id: 2, type: 1, checked: true }];
      const resultState = dataWranglingReducer(defaultState, DataWranglingScriptsRoutines.setScripts.trigger(scripts));

      expect(resultState.scripts).toEqual(scripts);
    });
  });
});
