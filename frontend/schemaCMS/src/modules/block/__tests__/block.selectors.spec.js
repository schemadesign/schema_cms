import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectBlockDomain, selectBlocks } from '../block.selectors';

describe('Block: selectors', () => {
  const state = Immutable({
    block: {},
  });

  describe('selectBlockDomain', () => {
    it('should select a domain', () => {
      expect(selectBlockDomain(state)).to.equal(state.block);
    });
  });

  describe('selectBlocks', () => {
    it('should select a blocks', () => {
      expect(selectBlocks(state)).to.equal(state.block.blocks);
    });
  });
});
