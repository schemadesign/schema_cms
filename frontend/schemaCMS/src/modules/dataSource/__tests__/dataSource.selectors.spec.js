import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import {
  selectDataSourceDomain,
  selectDataSource,
  selectDataSources,
  selectFields,
  selectPreviewTable,
  selectIsAnyJobProcessing,
  selectFieldsInfo,
} from '../dataSource.selectors';
import { JOB_STATE_PROCESSING } from '../../job/job.constants';

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
    },
    fieldsInfo: {},
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

    it('should select false if job is not processing or there is no job', () => {
      expect(selectIsAnyJobProcessing(state)).to.equal(false);
    });

    it('should select fields info', () => {
      expect(selectFieldsInfo(state)).to.equal(state.dataSource.fieldsInfo);
    });

    it('should select true if job is processing', () => {
      const newState = Immutable({
        dataSource: {
          ...state.dataSource,
          dataSource: {
            id: 1,
            jobs: [{ id: 1, jobState: JOB_STATE_PROCESSING }],
          },
        },
      });

      expect(selectIsAnyJobProcessing(newState)).to.equal(true);
    });
  });
});
