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
  fetchFields: createRoutine(`${prefix}FETCH_FIELDS`),
  unmountFields: createRoutine(`${prefix}UNMOUNT_FIELDS`),
  cancelFetchListLoop: createRoutine(`${prefix}CANCEL_FETCH_LIST_LOOP`),
  fetchOneDataWrangling: createRoutine(`${prefix}FETCH_ONE_DATA_WRANGLING`),
  unmountOneDataWrangling: createRoutine(`${prefix}UNMOUNT_ONE_DATA_WRANGLING`),
};

export const INITIAL_STATE = new Immutable({
  dataSource: {},
  dataSources: [],
  fields: {},
  previewTable: [],
  dataWranglingDetail: {},
});

const updateDataSource = (state = INITIAL_STATE, { payload }) => state.set('dataSource', payload);
const updateDataSources = (state = INITIAL_STATE, { payload }) => state.set('dataSources', payload);
const unmountDataSource = (state = INITIAL_STATE) => state.set('dataSource', {});

const updateFields = (state = INITIAL_STATE, { payload }) =>
  state.set('fields', payload.fields).set('previewTable', payload.data);
const unmountFields = (state = INITIAL_STATE) =>
  state.set('fields', INITIAL_STATE.fields).set('previewTable', INITIAL_STATE.previewTable);

const updateDataWranglingDetail = (state = INITIAL_STATE, { payload }) => state.set('dataWranglingDetail', payload);
const unmountDataWranglingDetail = (state = INITIAL_STATE) =>
  state.set('dataWranglingDetail', INITIAL_STATE.dataWranglingDetail);

export const reducer = createReducer(INITIAL_STATE, {
  [DataSourceRoutines.create.SUCCESS]: updateDataSource,
  [DataSourceRoutines.fetchOne.SUCCESS]: updateDataSource,
  [DataSourceRoutines.updateOne.SUCCESS]: updateDataSource,
  [DataSourceRoutines.unmountOne.TRIGGER]: unmountDataSource,
  [DataSourceRoutines.fetchList.SUCCESS]: updateDataSources,
  [DataSourceRoutines.fetchFields.SUCCESS]: updateFields,
  [DataSourceRoutines.unmountFields.SUCCESS]: unmountFields,
  [DataSourceRoutines.fetchOneDataWrangling.SUCCESS]: updateDataWranglingDetail,
  [DataSourceRoutines.unmountOneDataWrangling.SUCCESS]: unmountDataWranglingDetail,
});
