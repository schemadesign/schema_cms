import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectDataSourceTagDomain, selectTags, selectTag } from '../dataSourceTag.selectors';

describe('DataSourceTag: selectors', () => {
  const state = Immutable({
    dataSourceTag: {
      tags: [],
      tag: {},
    },
  });

  describe('selectDataSourceTagDomain', () => {
    it('should select a domain', () => {
      expect(selectDataSourceTagDomain(state)).to.equal(state.dataSourceTag);
    });
  });

  describe('selectTags', () => {
    it('should select a tags', () => {
      expect(selectTags(state)).to.equal(state.dataSourceTag.tags);
    });
  });

  describe('selectTag', () => {
    it('should select a tag', () => {
      expect(selectTag(state)).to.equal(state.dataSourceTag.tag);
    });
  });
});
