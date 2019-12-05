import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import {
  selectDataSourceDomain,
  selectDataSource,
  selectDataSources,
  selectFieldsInfo,
  selectPreviewData,
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
    },
    fieldsInfo: {},
    previewData: {
      fields: {
        id: {},
        name: {},
      },
      previewTable: [{ id: '1', name: 'test' }],
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
      expect(selectPreviewData(state)).to.equal(state.dataSource.previewData);
    });

    it('should select fields info', () => {
      expect(selectFieldsInfo(state)).to.equal(state.dataSource.fieldsInfo);
    });
  });
});
