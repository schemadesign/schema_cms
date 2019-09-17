import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { DataWranglingRoutines, reducer as dataWranglingReducer } from '../dataWrangling.redux';

describe('DataWrangling: redux', () => {
  const defaultState = Immutable({
    dataWrangling: {},
    dataWranglings: [],
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
      const dataWrangling = {
        description: 'file description',
        code: 'df.columns = map(str.lower, df.columns)',
      };
      const resultState = dataWranglingReducer(defaultState, DataWranglingRoutines.fetchOne.success(dataWrangling));

      expect(resultState.dataWrangling).to.deep.equal(dataWrangling);
    });
  });

  describe('when UNMOUNT_ONE/SUCCESS action is received', () => {
    it('should unmount dataWrangling ', () => {
      const resultState = dataWranglingReducer(defaultState, DataWranglingRoutines.unmountOne.success());

      expect(resultState.dataWrangling).to.deep.equal({});
    });
  });

  describe('when FETCH_LIST/SUCCESS action is received', () => {
    it('should set dataWrangling ', () => {
      const dataWrangling = ['data 1', 'data 2'];
      const resultState = dataWranglingReducer(defaultState, DataWranglingRoutines.fetchList.success(dataWrangling));

      expect(resultState.dataWrangling).to.deep.equal(dataWrangling);
    });
  });
});
