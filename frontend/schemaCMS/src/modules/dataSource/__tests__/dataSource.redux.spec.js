import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { DataSourceRoutines, reducer as dataSourceReducer } from '../dataSource.redux';

describe('DataSource: redux', () => {
  const defaultState = Immutable({
    dataSource: {},
    dataSources: [],
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
      const dataSource = [{ id: 1 }];
      const resultState = dataSourceReducer(defaultState, DataSourceRoutines.fetchOne.success(dataSource));

      expect(resultState.dataSource).to.deep.equal(dataSource);
    });
  });

  describe('when FETCH_ONE/SUCCESS action is received', () => {
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
});
