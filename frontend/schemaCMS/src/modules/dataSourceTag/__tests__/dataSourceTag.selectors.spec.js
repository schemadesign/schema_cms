import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectTagDomain, selectTags, selectTag } from '../dataSourceTag.selectors';

describe('Tag: selectors', () => {
  const state = Immutable({
    dataSourceTag: {
      tags: [],
      tag: {},
    },
  });

  describe('selectTagDomain', () => {
    it('should select a domain', () => {
      expect(selectTagDomain(state)).to.equal(state.tag);
    });
  });

  describe('selectTags', () => {
    it('should select a tags', () => {
      expect(selectTags(state)).to.equal(state.tag.tags);
    });
  });

  describe('selectTag', () => {
    it('should select a tag', () => {
      expect(selectTag(state)).to.equal(state.tag.tag);
    });
  });
});
