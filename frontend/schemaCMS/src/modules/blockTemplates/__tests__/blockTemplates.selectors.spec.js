import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectBlockTemplatesDomain, selectBlockTemplates } from '../blockTemplates.selectors';

describe('BlockTemplates: selectors', () => {
  const state = Immutable({
    blockTemplates: {
      blocks: [],
    },
  });

  describe('selectBlockTemplatesDomain', () => {
    it('should select a domain', () => {
      expect(selectBlockTemplatesDomain(state)).to.equal(state.blockTemplates);
    });
  });

  describe('selectBlockTemplates', () => {
    it('should select a blocks', () => {
      expect(selectBlockTemplates(state)).to.equal(state.blockTemplates.blocks);
    });
  });
});
