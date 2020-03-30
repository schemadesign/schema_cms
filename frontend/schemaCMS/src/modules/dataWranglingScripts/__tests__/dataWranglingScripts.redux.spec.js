import Immutable from 'seamless-immutable';

import { DataWranglingScriptsRoutines, reducer as dataWranglingReducer } from '../dataWranglingScripts.redux';

describe('DataWranglingScripts: redux', () => {
  const defaultState = Immutable({
    script: {
      specs: {},
    },
    scripts: [],
    checkedScripts: [],
    uncheckedScripts: [],
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
    it('should set scripts', () => {
      const data = [
        { id: 1, isPredefined: false },
        { id: 2, specs: ['1'], isPredefined: true },
        { id: 3, specs: [], isPredefined: true },
      ];
      const dataSource = {
        activeJob: {
          scripts: [
            { id: 3, execOrder: 0 },
            { id: 1, execOrder: 1 },
          ],
        },
      };

      const payload = { data, dataSource };
      const resultState = dataWranglingReducer(defaultState, DataWranglingScriptsRoutines.fetchList.success(payload));

      expect(resultState.scripts).toEqual(data);
      expect(resultState.uncheckedScripts).toEqual([{ id: 2, isPredefined: true, specs: ['1'], type: 1 }]);
      expect(resultState.checkedScripts).toEqual([
        { id: 3, isPredefined: true, specs: [], type: 2 },
        { id: 1, isPredefined: false, type: 0 },
      ]);
    });

    it('should not set scripts', () => {
      const data = [{ id: 1, isPredefined: false }];
      const payload = { fromScript: true, data };
      const resultState = dataWranglingReducer(defaultState, DataWranglingScriptsRoutines.fetchList.success(payload));
      expect(resultState).toEqual(defaultState);
    });

    it('should add only uploaded script', () => {
      const scripts = [
        { id: 1, isPredefined: false },
        { id: 2, specs: ['1'], isPredefined: true },
      ];
      const state = defaultState.set('scripts', scripts);
      const uploadedScript = { id: 3, specs: [], isPredefined: true };
      const data = [...scripts, uploadedScript];
      const payload = { uploadScript: true, data };
      const resultState = dataWranglingReducer(state, DataWranglingScriptsRoutines.fetchList.success(payload));

      expect(resultState.scripts).toEqual(data);
      expect(resultState.checkedScripts).toEqual([uploadedScript]);
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

    it('should set uncheckedScripts and checkedScripts', () => {
      const state = Immutable({
        scripts: [{ id: 1 }, { id: 2 }],
        imageScrapingFields: [],
        uncheckedScripts: [{ id: 1 }, { id: 2 }],
        checkedScripts: [],
        customScripts: [],
      });
      const payload = {
        imageScrapingFields: ['data 1', 'data 2'],
        scriptId: '1',
      };

      const resultState = dataWranglingReducer(
        state,
        DataWranglingScriptsRoutines.setImageScrapingFields.success(payload)
      );

      expect(resultState.uncheckedScripts).toEqual([{ id: 2 }]);
      expect(resultState.checkedScripts).toEqual([{ id: 1 }]);
    });
  });

  describe('when CLEAR_CUSTOM_SCRIPTS/SUCCESS action is received', () => {
    it('should set clearCustomScripts', () => {
      const state = Immutable({
        script: {
          specs: {},
        },
        scripts: [],
        uncheckedScripts: [],
        checkedScripts: [],
        imageScrapingFields: [1],
        customScripts: [1],
      });
      const resultState = dataWranglingReducer(state, DataWranglingScriptsRoutines.clearCustomScripts.trigger());

      expect(defaultState).toEqual(resultState);
    });
  });

  describe('when SET_SCRIPTS/TRIGGER action is received', () => {
    it('should set setScripts', () => {
      const state = Immutable({
        uncheckedScripts: [{ id: 2 }, { id: 3 }],
        checkedScripts: [{ id: 1 }],
      });
      const expectedState = Immutable({
        uncheckedScripts: [{ id: 3 }],
        checkedScripts: [{ id: 1 }, { id: 2 }],
      });
      const payload = { script: { id: 2 }, checked: true };
      const resultState = dataWranglingReducer(state, DataWranglingScriptsRoutines.setScripts.trigger(payload));

      expect(expectedState).toEqual(resultState);
    });
  });

  describe('when SET_CHECKED_SCRIPTS/TRIGGER action is received', () => {
    it('should set setCheckedScripts', () => {
      const payload = [{ id: 1 }, { id: 2 }];
      const resultState = dataWranglingReducer(
        defaultState,
        DataWranglingScriptsRoutines.setCheckedScripts.trigger(payload)
      );

      expect(resultState.checkedScripts).toEqual(payload);
    });
  });
});
