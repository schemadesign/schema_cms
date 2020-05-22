import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { reducer as metadataReducer, MetadataRoutines } from '../metadata.redux';

describe('Metadata: redux', () => {
  const state = Immutable({
    metadata: [],
  });

  describe('reducer', () => {
    it('should return initial state', () => {
      expect(metadataReducer(undefined, {})).to.deep.equal(state);
    });

    it('should return state on unknown action', () => {
      expect(metadataReducer(state, { type: 'unknown-action' })).to.deep.equal(state);
    });

    describe('when FETCH_METADATA_TAGS/SUCCESS action is received', () => {
      it('should set metadata ', () => {
        const metadata = [{ id: 1 }];
        const resultState = metadataReducer(state, MetadataRoutines.fetchMetadata.success(metadata));

        expect(resultState.metadata).to.deep.equal(metadata);
      });
    });

    describe('when UPDATE_METADATA_TAGS/SUCCESS action is received', () => {
      it('should set metadata ', () => {
        const metadata = [{ id: 1 }];
        const resultState = metadataReducer(state, MetadataRoutines.updateMetadata.success(metadata));

        expect(resultState.metadata).to.deep.equal(metadata);
      });
    });
  });
});
