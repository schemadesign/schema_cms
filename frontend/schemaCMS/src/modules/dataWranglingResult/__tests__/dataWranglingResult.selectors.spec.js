import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectDataWranglingResultDomain, selectFields, selectPreviewTable } from '../dataWranglingResult.selectors';

describe('DataWranglingResult: selectors', () => {
  const state = Immutable({
    dataWranglingResult: {
      fields: null,
      previewTable: [],
    },
  });

  describe('selectDataWranglingResultDomain', () => {
    it('should select a domain', () => {
      expect(selectDataWranglingResultDomain(state)).to.equal(state.dataWranglingResult);
    });

    it('should select a fields', () => {
      expect(selectFields(state)).to.equal(state.dataWranglingResult.fields);
    });

    it('should select a previewTable', () => {
      expect(selectPreviewTable(state)).to.equal(state.dataWranglingResult.previewTable);
    });
  });
});
