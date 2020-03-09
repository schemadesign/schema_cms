import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { reducer as blockTemplatesReducer, BlockTemplatesRoutines } from '../blockTemplates.redux';

describe('BlockTemplates: redux', () => {
  const state = Immutable({
    blockTemplate: { elements: [], name: '' },
    blockTemplates: [],
  });

  describe('reducer', () => {
    it('should return initial state', () => {
      expect(blockTemplatesReducer(undefined, {})).to.deep.equal(state);
    });

    it('should return state on unknown action', () => {
      expect(blockTemplatesReducer(state, { type: 'unknown-action' })).to.deep.equal(state);
    });
  });

  describe('when BLOCK_TEMPLATES/FETCH_BLOCK_TEMPLATES_SUCCESS action is received', () => {
    it('should set block templates', () => {
      const blockTemplates = [{ data: 'data' }];
      const resultState = blockTemplatesReducer(
        state,
        BlockTemplatesRoutines.fetchBlockTemplates.success(blockTemplates)
      );

      expect(resultState.blockTemplates).to.deep.equal(blockTemplates);
    });
  });

  describe('when BLOCK_TEMPLATES/FETCH_BLOCK_TEMPLATES_SUCCESS action is received', () => {
    it('should set templates', () => {
      const blockTemplate = { data: 'data' };
      const resultState = blockTemplatesReducer(
        state,
        BlockTemplatesRoutines.fetchBlockTemplate.success(blockTemplate)
      );

      expect(resultState.blockTemplate).to.deep.equal(blockTemplate);
    });
  });
});
