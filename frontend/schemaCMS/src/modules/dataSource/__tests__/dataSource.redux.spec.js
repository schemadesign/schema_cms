import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { DataSourceRoutines, reducer as dataSourceReducer } from '../dataSource.redux';

describe('DataSource: redux', () => {
  const defaultState = Immutable({
    dataSource: {},
    dataSources: [],
    previewData: {},
    fieldsInfo: [],
    uploadingDataSources: [],
  });

  describe('reducer', () => {
    it('should return initial state', () => {
      expect(dataSourceReducer(undefined, {})).to.deep.equal(defaultState);
    });
  });

  describe('when FETCH_ONE/SUCCESS action is received', () => {
    it('should set dataSource ', () => {
      const dataSource = [{ id: 1 }];
      const resultState = dataSourceReducer(defaultState, DataSourceRoutines.fetchOne.success(dataSource));

      expect(resultState.dataSource).to.deep.equal(dataSource);
    });
  });

  describe('when CREATE/SUCCESS action is received', () => {
    it('should set dataSource ', () => {
      const dataSource = [{ id: 1 }];
      const resultState = dataSourceReducer(defaultState, DataSourceRoutines.create.success({ dataSource }));

      expect(resultState.dataSource).to.deep.equal(dataSource);
      expect(resultState.uploadingDataSources).to.deep.equal([]);
    });

    it('should set dataSource and uploadingDataSources', () => {
      const dataSource = [{ id: 1 }];
      const resultState = dataSourceReducer(
        defaultState,
        DataSourceRoutines.create.success({ dataSource, isUpload: true })
      );

      expect(resultState.dataSource).to.deep.equal(dataSource);
      expect(resultState.uploadingDataSources).to.deep.equal([dataSource]);
    });
  });

  describe('when FETCH_ONE/SUCCESS action is received', () => {
    it('should set dataSource ', () => {
      const dataSource = { id: 1 };
      const resultState = dataSourceReducer(defaultState, DataSourceRoutines.fetchOne.success(dataSource));

      expect(resultState.dataSource).to.deep.equal(dataSource);
    });
  });

  describe('when FETCH_LIST/SUCCESS action is received', () => {
    it('should set dataSource ', () => {
      const dataSources = [{ id: 1 }];
      const resultState = dataSourceReducer(defaultState, DataSourceRoutines.fetchList.success(dataSources));

      expect(resultState.dataSources).to.deep.equal(dataSources);
    });
  });

  describe('when UPDATE_ONE/SUCCESS action is received', () => {
    it('should set dataSource ', () => {
      const dataSource = [{ id: 2 }];
      const resultState = dataSourceReducer(defaultState, DataSourceRoutines.updateOne.success({ dataSource }));

      expect(resultState.dataSource).to.deep.equal(dataSource);
      expect(resultState.uploadingDataSources).to.deep.equal([]);
    });

    it('should set dataSource and uploadingDataSources', () => {
      const dataSource = [{ id: 2 }];
      const resultState = dataSourceReducer(
        defaultState,
        DataSourceRoutines.updateOne.success({ dataSource, isUpload: true })
      );

      expect(resultState.dataSource).to.deep.equal(dataSource);
      expect(resultState.uploadingDataSources).to.deep.equal([dataSource]);
    });
  });

  describe('when FETCH_PREVIEW/SUCCESS action is received', () => {
    it('should set previewData ', () => {
      const previewData = {
        fields: {
          id: {},
          name: {},
        },
        previewTable: [{ id: '1', name: 'test' }],
      };
      const resultState = dataSourceReducer(defaultState, DataSourceRoutines.fetchPreview.success(previewData));

      expect(resultState.previewData).to.deep.equal(previewData);
    });
  });

  describe('when FETCH_FIELDS_INFO/SUCCESS action is received', () => {
    it('should set fields info ', () => {
      const data = { data: 'data' };
      const resultState = dataSourceReducer(defaultState, DataSourceRoutines.fetchFieldsInfo.success(data));

      expect(resultState.fieldsInfo).to.deep.equal(data);
    });

    describe('when UPDATE_UPLOADING_DATA_SOURCE_STATUS/TRIGGER action is received', () => {
      it('should set uploadingDataSources and dataSources', () => {
        const data = [
          { id: 'id', name: 'name 1' },
          { id: 'id 2', name: 'name 2' },
        ];
        const updatedElement = { id: 'id', name: 'updated name' };
        const state = Immutable({
          uploadingDataSources: data,
          dataSources: data,
        });
        const resultState = dataSourceReducer(
          state,
          DataSourceRoutines.updateUploadingDataSourceStatus({ data: updatedElement })
        );

        expect(resultState.uploadingDataSources).to.deep.equal([data[1]]);
        expect(resultState.dataSources).to.deep.equal([updatedElement, data[1]]);
      });

      it('should set error on uploadingDataSources', () => {
        const data = [
          { id: 'id', name: 'name 1' },
          { id: 'id 2', name: 'name 2' },
        ];
        const updatedElement = { id: 'id', name: 'updated name' };
        const state = Immutable({
          uploadingDataSources: data,
          dataSources: data,
        });
        const resultState = dataSourceReducer(
          state,
          DataSourceRoutines.updateUploadingDataSourceStatus({ data: updatedElement, error: 'error' })
        );

        expect(resultState.uploadingDataSources).to.deep.equal([
          { error: 'error', id: 'id', name: 'updated name' },
          { id: 'id 2', name: 'name 2' },
        ]);
      });
    });
  });
});
