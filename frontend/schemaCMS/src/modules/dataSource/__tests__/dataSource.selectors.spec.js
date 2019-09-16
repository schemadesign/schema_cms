import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import {
  selectDataSourceDomain,
  selectDataSource,
  selectDataSources,
  selectFields,
  selectPreviewTable,
  selectDataWranglingDetail,
} from '../dataSource.selectors';

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
      fields: {
        id: {},
        name: {},
      },
      previewTable: [{ id: '1', name: 'test' }],
      dataWranglingDetail: {
        description: 'test',
        code: 'alert("Hello World!");',
      },
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

    it('should select a fields', () => {
      expect(selectFields(state)).to.equal(state.dataSource.fields);
    });

    it('should select a previewTable', () => {
      expect(selectPreviewTable(state)).to.equal(state.dataSource.previewTable);
    });

    it('should select a dataWranglingDetail', () => {
      expect(selectDataWranglingDetail(state)).to.equal(state.dataSource.dataWranglingDetail);
    });
  });
});
