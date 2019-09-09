import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectDataSourceDomain, selectDataSource, selectDataSources } from '../dataSource.selectors';

describe('DataSource: selectors', () => {
  const state = Immutable({
    dataSource: {
      dataSource: {
        id: 1,
      },
      dataSources: [
        {
          id: 1,
        },
      ],
    },
  });

  describe('selectDataSourceDomain', () => {
    it('should select a domain', () => {
      expect(selectDataSourceDomain(state)).to.equal(state.dataSource);
    });

    it('should select a dataSource', () => {
      expect(selectDataSource(state)).to.equal(state.dataSource.dataSource);
    });

    it('should select a dataSources', () => {
      expect(selectDataSources(state)).to.equal(state.dataSource.dataSources);
    });
  });
});
