import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { reducer as blockTemplatesReducer, BlockTemplatesRoutines } from '../blockTemplates.redux';

describe('BlockTemplates: redux', () => {
  const state = Immutable({
    blocks: [],
  });

  describe('reducer', () => {
    it('should return initial state', () => {
      expect(blockTemplatesReducer(undefined, {})).to.deep.equal(state);
    });

    it('should return state on unknown action', () => {
      expect(blockTemplatesReducer(state, { type: 'unknown-action' })).to.deep.equal(state);
    });
  });

  describe('when BLOCK_TEMPLATES/FETCH_BLOCKS_SUCCESS action is received', () => {
    it('should set templates', () => {
      const blocks = [{ data: 'data' }];
      const resultState = blockTemplatesReducer(state, BlockTemplatesRoutines.fetchBlocks.success(blocks));

      expect(resultState.blocks).to.deep.equal(blocks);
    });
  });
});
