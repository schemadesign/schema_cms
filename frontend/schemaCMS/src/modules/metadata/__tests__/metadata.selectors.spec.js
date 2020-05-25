import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectMetadataDomain, selectMetadata } from '../metadata.selectors';

describe('Metadata: selectors', () => {
  const state = Immutable({
    metadata: {},
  });

  describe('selectMetadataDomain', () => {
    it('should select a domain', () => {
      expect(selectMetadataDomain(state)).to.equal(state.metadata);
    });
  });

  describe('selectMetadata', () => {
    it('should select a metadata', () => {
      expect(selectMetadata(state)).to.equal(state.metadata.metadata);
    });
  });
});
