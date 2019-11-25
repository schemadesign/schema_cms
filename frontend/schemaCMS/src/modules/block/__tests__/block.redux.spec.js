import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { reducer as blockReducer, BlockRoutines } from '../block.redux';

describe('Block: redux', () => {
  const state = Immutable({
    blocks: [],
  });

  describe('reducer', () => {
    it('should return initial state', () => {
      expect(blockReducer(undefined, {})).to.deep.equal(state);
    });

    it('should return state on unknown action', () => {
      expect(blockReducer(state, { type: 'unknown-action' })).to.deep.equal(state);
    });
  });

  describe('when BLOCK/FETCH_LIST action is received', () => {
    it('should set blocks', () => {
      const blocks = [{ data: 'data' }];

      const resultState = blockReducer(state, BlockRoutines.fetchList.success(blocks));
      expect(resultState.blocks).to.deep.equal(blocks);
    });
  });

  describe('when BLOCK/SET_BLOCKS action is received', () => {
    it('should set blocks', () => {
      const blocks = [{ data: 'data' }];

      const resultState = blockReducer(state, BlockRoutines.setBlocks.success(blocks));
      expect(resultState.blocks).to.deep.equal(blocks);
    });
  });
});
