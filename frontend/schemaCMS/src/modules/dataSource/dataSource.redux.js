import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';

const prefix = 'DATA_SOURCE/';

export const DataSourceRoutines = {
  create: createRoutine(`${prefix}CREATE`),
  fetchOne: createRoutine(`${prefix}FETCH_ONE`),
  updateOne: createRoutine(`${prefix}UPDATE_ONE`),
  processOne: createRoutine(`${prefix}PROCESS_ONE`),
  unmountOne: createRoutine(`${prefix}UNMOUNT_ONE`),
  fetchFields: createRoutine(`${prefix}FETCH_FIELDS`),
  unmountFields: createRoutine(`${prefix}UNMOUNT_FIELDS`),
};

export const INITIAL_STATE = new Immutable({
  dataSource: {},
  dataSources: [],
  fields: [],
});

const updateDataSource = (state = INITIAL_STATE, { payload }) => state.set('dataSource', payload);
const unmountDataSource = (state = INITIAL_STATE) => state.set('dataSource', {});

const updateFields = (state = INITIAL_STATE, { payload }) => state.set('fields', payload);
const unmountFields = (state = INITIAL_STATE) => state.set('fields', INITIAL_STATE.fields);

export const reducer = createReducer(INITIAL_STATE, {
  [DataSourceRoutines.create.SUCCESS]: updateDataSource,
  [DataSourceRoutines.fetchOne.SUCCESS]: updateDataSource,
  [DataSourceRoutines.updateOne.SUCCESS]: updateDataSource,
  [DataSourceRoutines.unmountOne.TRIGGER]: unmountDataSource,
  [DataSourceRoutines.fetchFields.SUCCESS]: updateFields,
  [DataSourceRoutines.unmountFields.SUCCESS]: unmountFields,
});
