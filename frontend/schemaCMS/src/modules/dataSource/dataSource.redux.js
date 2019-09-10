import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';

const prefix = 'DATA_SOURCE/';

export const DataSourceRoutines = {
  create: createRoutine(`${prefix}CREATE`),
  removeOne: createRoutine(`${prefix}REMOVE`),
  fetchOne: createRoutine(`${prefix}FETCH_ONE`),
  fetchList: createRoutine(`${prefix}FETCH_LIST`),
  updateOne: createRoutine(`${prefix}UPDATE_ONE`),
  processOne: createRoutine(`${prefix}PROCESS_ONE`),
  unmountOne: createRoutine(`${prefix}UNMOUNT_ONE`),
};

export const INITIAL_STATE = new Immutable({
  dataSource: {},
  dataSources: [],
});

const updateDataSource = (state = INITIAL_STATE, { payload }) => state.set('dataSource', payload);
const updateDataSources = (state = INITIAL_STATE, { payload }) => state.set('dataSources', payload);
const unmountDataSource = (state = INITIAL_STATE) => state.set('dataSource', {});

export const reducer = createReducer(INITIAL_STATE, {
  [DataSourceRoutines.create.SUCCESS]: updateDataSource,
  [DataSourceRoutines.fetchOne.SUCCESS]: updateDataSource,
  [DataSourceRoutines.updateOne.SUCCESS]: updateDataSource,
  [DataSourceRoutines.unmountOne.TRIGGER]: unmountDataSource,
  [DataSourceRoutines.fetchList.SUCCESS]: updateDataSources,
});
