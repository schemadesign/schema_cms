import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { reducer as blockReducer, PageBlockRoutines } from '../pageBlock.redux';

describe('PageBlock: redux', () => {
  const state = Immutable({
    pageBlocks: [],
  });

  describe('reducer', () => {
    it('should return initial state', () => {
      expect(blockReducer(undefined, {})).to.deep.equal(state);
    });

    it('should return state on unknown action', () => {
      expect(blockReducer(state, { type: 'unknown-action' })).to.deep.equal(state);
    });
  });

  describe('when PAGE_BLOCK/FETCH_LIST action is received', () => {
    it('should set blocks', () => {
      const pageBlocks = [{ data: 'data' }];

      const resultState = blockReducer(state, PageBlockRoutines.fetchList.success(pageBlocks));
      expect(resultState.pageBlocks).to.deep.equal(pageBlocks);
    });
  });

  describe('when PAGE_BLOCK/SET_BLOCKS action is received', () => {
    it('should set blocks', () => {
      const pageBlocks = [{ data: 'data' }];

      const resultState = blockReducer(state, PageBlockRoutines.setBlocks.success(pageBlocks));
      expect(resultState.pageBlocks).to.deep.equal(pageBlocks);
    });
  });
});
