import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectBlockTemplatesDomain, selectBlockTemplates, selectBlockTemplate } from '../blockTemplates.selectors';
import { blockTemplate, blockTemplates } from '../blockTemplates.mocks';

describe('BlockTemplates: selectors', () => {
  const state = Immutable({
    blockTemplates: {
      blockTemplates,
      blockTemplate,
    },
  });

  describe('selectBlockTemplatesDomain', () => {
    it('should select a domain', () => {
      expect(selectBlockTemplatesDomain(state)).to.equal(state.blockTemplates);
    });
  });

  describe('selectBlockTemplates', () => {
    it('should select a block templates', () => {
      expect(selectBlockTemplates(state)).to.equal(state.blockTemplates.blockTemplates);
    });
  });

  describe('selectBlockTemplate', () => {
    it('should select a block template', () => {
      expect(selectBlockTemplate(state)).to.equal(state.blockTemplates.blockTemplate);
    });
  });
});
