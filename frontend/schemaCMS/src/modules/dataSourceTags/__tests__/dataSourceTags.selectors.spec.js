import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectDataSourceTagsDomain } from '../dataSourceTags.selectors';

describe('DataSourceTags: selectors', () => {
  const state = Immutable({
    dataSourceTags: {},
  });

  describe('selectDataSourceTagsDomain', () => {
    it('should select a domain', () => {
      expect(selectDataSourceTagsDomain(state)).to.equal(state.dataSourceTags);
    });
  });
});
