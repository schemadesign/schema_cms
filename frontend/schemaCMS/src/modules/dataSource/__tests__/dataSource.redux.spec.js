import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { DataSourceRoutines, reducer as dataSourceReducer } from '../dataSource.redux';

describe('DataSource: redux', () => {
  const defaultState = Immutable({
    dataSource: {},
    dataSources: [],
    fields: {},
    previewTable: [],
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

  describe('when FETCH_FIELDS/SUCCESS action is received', () => {
    it('should set fields and previewTable ', () => {
      const data = [{ fields: { id: {}, data: [{ id: '1' }] } }];
      const resultState = dataSourceReducer(defaultState, DataSourceRoutines.fetchFields.success(data));

      expect(resultState.fields).to.deep.equal(data.fields);
      expect(resultState.previewTable).to.deep.equal(data.data);
    });
  });

  describe('when UNMOUNT_FIEDLS/SUCCESS action is received', () => {
    it('should unmount fields and previewTable ', () => {
      const resultState = dataSourceReducer(defaultState, DataSourceRoutines.unmountFields.success());

      expect(resultState.fields).to.deep.equal(defaultState.fields);
      expect(resultState.previewTable).to.deep.equal(defaultState.previewTable);
    });
  });
});
