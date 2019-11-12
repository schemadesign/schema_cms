import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';
import { sort, descend, prop } from 'ramda';

const prefix = 'DATA_SOURCE/';

export const DataSourceRoutines = {
  create: createRoutine(`${prefix}CREATE`),
  removeOne: createRoutine(`${prefix}REMOVE`),
  fetchOne: createRoutine(`${prefix}FETCH_ONE`),
  fetchList: createRoutine(`${prefix}FETCH_LIST`),
  updateOne: createRoutine(`${prefix}UPDATE_ONE`),
  unmountOne: createRoutine(`${prefix}UNMOUNT_ONE`),
  cancelFetchListLoop: createRoutine(`${prefix}CANCEL_FETCH_LIST_LOOP`),
  fetchFieldsInfo: createRoutine(`${prefix}FETCH_FIELDS_INFO`),
  revertToJob: createRoutine(`${prefix}REVER_TO_JOB`),
  fetchPreview: createRoutine(`${prefix}FETCH_PREVIEW`),
};

export const INITIAL_STATE = new Immutable({
  dataSource: {},
  dataSources: [],
  previewData: {},
  fieldsInfo: {},
});

const sortByDate = sort(descend(prop('created')));

const updateDataSource = (state = INITIAL_STATE, { payload }) => state.set('dataSource', payload);
const updateDataSources = (state = INITIAL_STATE, { payload }) => state.set('dataSources', sortByDate(payload));
const unmountDataSource = (state = INITIAL_STATE) => state.set('dataSource', {});
const setFieldsInfo = (state = INITIAL_STATE, { payload }) => state.set('fieldsInfo', payload);
const setPreviewData = (state = INITIAL_STATE, { payload }) => state.set('previewData', payload);

export const reducer = createReducer(INITIAL_STATE, {
  [DataSourceRoutines.create.SUCCESS]: updateDataSource,
  [DataSourceRoutines.fetchOne.SUCCESS]: updateDataSource,
  [DataSourceRoutines.updateOne.SUCCESS]: updateDataSource,
  [DataSourceRoutines.unmountOne.TRIGGER]: unmountDataSource,
  [DataSourceRoutines.fetchList.SUCCESS]: updateDataSources,
  [DataSourceRoutines.fetchFieldsInfo.SUCCESS]: setFieldsInfo,
  [DataSourceRoutines.fetchPreview.SUCCESS]: setPreviewData,
});
