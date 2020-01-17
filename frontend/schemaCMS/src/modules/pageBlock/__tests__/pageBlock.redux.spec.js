import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { PageBlockRoutines, reducer as blockReducer } from '../pageBlock.redux';

describe('PageBlock: redux', () => {
  const state = Immutable({
    pageBlocks: [],
    pageBlock: {},
    temporaryPageBlocks: [],
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

  describe('when PAGE_BLOCK/FETCH_ONE action is received', () => {
    it('should set block', () => {
      const pageBlock = { data: 'data' };

      const resultState = blockReducer(state, PageBlockRoutines.fetchOne.success(pageBlock));
      expect(resultState.pageBlock).to.deep.equal(pageBlock);
    });
  });

  describe('when PAGE_BLOCK/SAVE_TEMPORARY_BLOCKS action is received', () => {
    it('should set block', () => {
      const temporaryPageBlocks = [{ data: 'data' }];

      const resultState = blockReducer(state, PageBlockRoutines.saveTemporaryBlocks.trigger(temporaryPageBlocks));
      expect(resultState.temporaryPageBlocks).to.deep.equal(temporaryPageBlocks);
    });
  });

  describe('when PAGE_BLOCK/REMOVE_ONE action is received', () => {
    it('should remove temporary block', () => {
      const temporaryPageBlocks = [{ id: 1 }, { id: 2 }];
      const defaultState = Immutable({ temporaryPageBlocks });

      const resultState = blockReducer(defaultState, PageBlockRoutines.removeOne.success({ blockId: '1' }));
      expect(resultState.temporaryPageBlocks).to.deep.equal([temporaryPageBlocks[1]]);
    });
  });

  describe('when PAGE_BLOCK/CREATE_ONE action is received', () => {
    it('should add temporary block', () => {
      const temporaryPageBlocks = [{ id: 1 }, { id: 2 }];
      const newBlock = { id: 3 };
      const defaultState = Immutable({ temporaryPageBlocks });

      const resultState = blockReducer(defaultState, PageBlockRoutines.create.success(newBlock));
      expect(resultState.temporaryPageBlocks).to.deep.equal([...temporaryPageBlocks, newBlock]);
    });
  });

  describe('when PAGE_BLOCK/UPDATE_ONE action is received', () => {
    it('should update temporary block', () => {
      const temporaryPageBlocks = [{ id: 1, name: 'name' }, { id: 2, name: 'name 2' }];
      const newBlock = { id: 2, name: 'new name' };
      const defaultState = Immutable({ temporaryPageBlocks });

      const resultState = blockReducer(defaultState, PageBlockRoutines.update.success(newBlock));
      expect(resultState.temporaryPageBlocks).to.deep.equal([temporaryPageBlocks[0], newBlock]);
    });
  });
});
