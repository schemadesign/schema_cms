import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { DataWranglingRoutines, reducer as dataWranglingReducer } from '../dataWrangling.redux';

describe('DataWrangling: redux', () => {
  const defaultState = Immutable({
    dataWrangling: {},
    dataWranglings: [],
  });

  describe('when FETCH_ONE/SUCCESS action is received', () => {
    it('should set dataWrangling ', () => {
      const dataWrangling = [{ id: 1 }];
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
});
