import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectPageBlockDomain, selectPageBlocks } from '../pageBlock.selectors';

describe('PageBlock: selectors', () => {
  const state = Immutable({
    pageBlock: {
      pageBlocks: [],
    },
  });

  describe('selectPageBlockDomain', () => {
    it('should select a domain', () => {
      expect(selectPageBlockDomain(state)).to.equal(state.pageBlock);
    });
  });

  describe('selectPageBlocks', () => {
    it('should select a page blocks', () => {
      expect(selectPageBlocks(state)).to.equal(state.pageBlock.pageBlocks);
    });
  });
});
