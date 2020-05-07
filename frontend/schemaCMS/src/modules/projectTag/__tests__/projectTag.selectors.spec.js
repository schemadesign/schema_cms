import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectProjectTagDomain, selectTags, selectTag } from '../projectTag.selectors';

describe('ProjectTag: selectors', () => {
  const state = Immutable({
    projectTag: {
      tags: [],
      tag: {},
    },
  });

  describe('selectProjectTagDomain', () => {
    it('should select a domain', () => {
      expect(selectProjectTagDomain(state)).to.equal(state.projectTag);
    });
  });

  describe('selectTags', () => {
    it('should select a tags', () => {
      expect(selectTags(state)).to.equal(state.projectTag.tags);
    });
  });

  describe('selectTag', () => {
    it('should select a tag', () => {
      expect(selectTag(state)).to.equal(state.projectTag.tag);
    });
  });
});
