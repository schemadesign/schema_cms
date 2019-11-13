import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { DataSourceRoutines, reducer as dataSourceReducer } from '../dataSource.redux';

describe('DataSource: redux', () => {
  const defaultState = Immutable({
    dataSource: {},
    dataSources: [],
    previewData: {},
    fieldsInfo: {},
  });

  describe('reducer', () => {
    it('should return initial state', () => {
      expect(dataSourceReducer(undefined, {})).to.deep.equal(defaultState);
    });
  });

  describe('when CREATE/SUCCESS action is received', () => {
    it('should set dataSource ', () => {
      const dataSource = [{ id: 1 }];
      const resultState = dataSourceReducer(defaultState, DataSourceRoutines.create.success(dataSource));

      expect(resultState.dataSource).to.deep.equal(dataSource);
    });
  });

  describe('when FETCH_ONE/SUCCESS action is received', () => {
    it('should set dataSource ', () => {
      const dataSource = [{ id: 1 }];
      const resultState = dataSourceReducer(defaultState, DataSourceRoutines.fetchOne.success(dataSource));

      expect(resultState.dataSource).to.deep.equal(dataSource);
    });
  });

  describe('when UNMOUNT_ONE/SUCCESS action is received', () => {
    it('should unmount dataSource ', () => {
      const resultState = dataSourceReducer(defaultState, DataSourceRoutines.unmountOne.success());

      expect(resultState.dataSource).to.deep.equal({});
    });
  });

  describe('when CREATE/SUCCESS action is received', () => {
    it('should set dataSource ', () => {
      const dataSource = [{ id: 1 }];
      const resultState = dataSourceReducer(defaultState, DataSourceRoutines.create.success(dataSource));

      expect(resultState.dataSource).to.deep.equal(dataSource);
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
      const resultState = dataSourceReducer(defaultState, DataSourceRoutines.updateOne.success(dataSource));

      expect(resultState.dataSource).to.deep.equal(dataSource);
    });
  });

  describe('when UNMOUNT_ONE/SUCCESS action is received', () => {
    it('should unmount dataSource ', () => {
      const resultState = dataSourceReducer(defaultState, DataSourceRoutines.unmountOne.success());

      expect(resultState.dataSource).to.deep.equal({});
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
  });
});
