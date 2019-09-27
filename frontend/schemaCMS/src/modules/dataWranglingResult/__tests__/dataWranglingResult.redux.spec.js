import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { reducer as dataWranglingResultReducer, DataWrangligResultRoutines } from '../dataWranglingResult.redux';

describe('DataWranglingResult: redux', () => {
  const state = Immutable({
    fields: null,
    previewTable: [],
  });

  describe('reducer', () => {
    it('should return initial state', () => {
      expect(dataWranglingResultReducer(undefined, {})).to.deep.equal(state);
    });
  });

  describe('when FETCH/SUCCESS action is received', () => {
    it('should set fields and previewTable ', () => {
      const data = [{ fields: { id: {}}, previewTable: [{ id: '1' }] }];
      const resultState = dataWranglingResultReducer(state, DataWrangligResultRoutines.fetch.success(data));

      expect(resultState.fields).to.deep.equal(data.fields);
      expect(resultState.previewTable).to.deep.equal(data.data);
    });
  });

  describe('when UNMOUNT/SUCCESS action is received', () => {
    it('should unmount fields and previewTable ', () => {
      const resultState = dataWranglingResultReducer(state, DataWrangligResultRoutines.unmount.trigger());

      expect(resultState.fields).to.deep.equal(state.fields);
      expect(resultState.previewTable).to.deep.equal(state.previewTable);
    });
  });
});
