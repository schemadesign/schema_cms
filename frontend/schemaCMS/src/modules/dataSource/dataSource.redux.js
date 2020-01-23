import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';
import { propEq, reject } from 'ramda';

const prefix = 'DATA_SOURCE/';

export const DataSourceRoutines = {
  create: createRoutine(`${prefix}CREATE`),
  removeOne: createRoutine(`${prefix}REMOVE`),
  fetchOne: createRoutine(`${prefix}FETCH_ONE`),
  fetchList: createRoutine(`${prefix}FETCH_LIST`),
  updateOne: createRoutine(`${prefix}UPDATE_ONE`),
  cancelFetchListLoop: createRoutine(`${prefix}CANCEL_FETCH_LIST_LOOP`),
  fetchFieldsInfo: createRoutine(`${prefix}FETCH_FIELDS_INFO`),
  revertToJob: createRoutine(`${prefix}REVERT_TO_JOB`),
  fetchPreview: createRoutine(`${prefix}FETCH_PREVIEW`),
  removeUploadingDataSource: createRoutine(`${prefix}REMOVE_UPLOADING_DATA_SOURCE`),
};

export const INITIAL_STATE = new Immutable({
  dataSource: {},
  dataSources: [],
  previewData: {},
  fieldsInfo: {},
  uploadingDataSources: [],
});

const updateDataSource = (state = INITIAL_STATE, { payload }) => state.set('dataSource', payload);
const updateDataSources = (state = INITIAL_STATE, { payload }) => state.set('dataSources', payload);
const setFieldsInfo = (state = INITIAL_STATE, { payload }) => state.set('fieldsInfo', payload);
const setPreviewData = (state = INITIAL_STATE, { payload }) => state.set('previewData', payload);
const setUploadingDataSource = (state = INITIAL_STATE, { payload }) =>
  state.update('uploadingDataSources', uploadingDataSources => [...uploadingDataSources, payload]);
const removeUploadingDataSource = (state = INITIAL_STATE, { payload }) =>
  state.set('dataSource', payload).update('uploadingDataSources', reject(propEq('id', payload.id)));

export const reducer = createReducer(INITIAL_STATE, {
  [DataSourceRoutines.removeUploadingDataSource.trigger]: removeUploadingDataSource,
  [DataSourceRoutines.create.SUCCESS]: setUploadingDataSource,
  [DataSourceRoutines.fetchOne.SUCCESS]: updateDataSource,
  [DataSourceRoutines.updateOne.SUCCESS]: updateDataSource,
  [DataSourceRoutines.fetchList.SUCCESS]: updateDataSources,
  [DataSourceRoutines.fetchFieldsInfo.SUCCESS]: setFieldsInfo,
  [DataSourceRoutines.fetchPreview.SUCCESS]: setPreviewData,
  [DataSourceRoutines.revertToJob.SUCCESS]: updateDataSource,
});
