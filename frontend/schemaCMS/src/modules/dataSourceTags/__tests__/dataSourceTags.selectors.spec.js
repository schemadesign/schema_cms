import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectDataSourceTagsDomain, selectDataSourceTags } from '../dataSourceTags.selectors';

describe('DataSourceTags: selectors', () => {
  const state = Immutable({
    dataSourceTags: {
      dataSourceTags: [],
    },
  });

  describe('selectDataSourceTagsDomain', () => {
    it('should select a domain', () => {
      expect(selectDataSourceTagsDomain(state)).to.equal(state.dataSourceTags);
    });
  });

  describe('selectDataSourceTags', () => {
    it('should select a data source tags', () => {
      expect(selectDataSourceTags(state)).to.equal(state.dataSourceTags.dataSourceTags);
    });
  });
});
