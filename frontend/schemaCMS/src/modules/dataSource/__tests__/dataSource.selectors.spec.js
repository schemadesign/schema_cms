import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectDataSourceDomain } from '../dataSource.selectors';

describe('DataSource: selectors', () => {
  const state = Immutable({
    dataSource: {},
  });

  describe('selectDataSourceDomain', () => {
    it('should select a domain', () => {
      expect(selectDataSourceDomain(state)).to.equal(state.dataSource);
    });
  });
});
