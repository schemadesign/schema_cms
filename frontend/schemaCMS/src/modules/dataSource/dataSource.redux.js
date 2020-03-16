import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';
import { always, propEq, reject, when, map, identity, ifElse } from 'ramda';

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
  updateUploadingDataSourceStatus: createRoutine(`${prefix}UPDATE_UPLOADING_DATA_SOURCE_STATUS`),
  updateProgress: createRoutine(`${prefix}UPDATE_PROGRESS`),
};

export const INITIAL_STATE = new Immutable({
  dataSource: {},
  dataSources: [],
  previewData: {},
  fieldsInfo: [],
  uploadingDataSources: [],
});

const updateDataSource = (state = INITIAL_STATE, { payload }) => state.set('dataSource', payload);
const updateDataSources = (state = INITIAL_STATE, { payload }) => state.set('dataSources', payload);
const setFieldsInfo = (state = INITIAL_STATE, { payload }) => state.set('fieldsInfo', payload);
const setPreviewData = (state = INITIAL_STATE, { payload }) => state.set('previewData', payload);
const setUploadingDataSource = (state = INITIAL_STATE, { payload: { dataSource, isUpload = false } }) =>
  state
    .set('dataSource', dataSource)
    .update('uploadingDataSources', uploadingDataSources =>
      isUpload ? [...uploadingDataSources, dataSource] : uploadingDataSources
    );
const updateProgress = (state = INITIAL_STATE, { payload: { id, progress } }) =>
  state.update('uploadingDataSources', uploadingDataSources =>
    uploadingDataSources.map(data => (data.id === id ? { ...data, progress } : data))
  );
const updateUploadingDataSourceStatus = (state = INITIAL_STATE, { payload: { data, error } }) =>
  state
    .update(
      'uploadingDataSources',
      error ? map(ifElse(propEq('id', data.id), item => ({ ...item, error }), identity)) : reject(propEq('id', data.id))
    )
    .update('dataSources', dataSources =>
      data.name ? map(when(propEq('id', data.id), always(data)))(dataSources) : dataSources
    );

export const reducer = createReducer(INITIAL_STATE, {
  [DataSourceRoutines.updateUploadingDataSourceStatus.TRIGGER]: updateUploadingDataSourceStatus,
  [DataSourceRoutines.create.SUCCESS]: setUploadingDataSource,
  [DataSourceRoutines.updateOne.SUCCESS]: setUploadingDataSource,
  [DataSourceRoutines.fetchOne.SUCCESS]: updateDataSource,
  [DataSourceRoutines.fetchList.SUCCESS]: updateDataSources,
  [DataSourceRoutines.fetchFieldsInfo.SUCCESS]: setFieldsInfo,
  [DataSourceRoutines.fetchPreview.SUCCESS]: setPreviewData,
  [DataSourceRoutines.revertToJob.SUCCESS]: updateDataSource,
  [DataSourceRoutines.updateProgress.SUCCESS]: updateProgress,
});
