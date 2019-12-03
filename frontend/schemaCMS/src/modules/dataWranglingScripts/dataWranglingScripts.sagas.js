import { all, put, takeLatest, select } from 'redux-saga/effects';

import { DataWranglingScriptsRoutines } from './dataWranglingScripts.redux';
import api from '../../shared/services/api';
import {
  DATA_SOURCES_PATH,
  DATA_WRANGLING_JOB_PATH,
  DATA_WRANGLING_SCRIPTS_PATH,
} from '../../shared/utils/api.constants';
import browserHistory from '../../shared/utils/history';

import { selectDataSource } from '../dataSource';

function* fetchList({ payload: { dataSourceId } }) {
  try {
    yield put(DataWranglingScriptsRoutines.fetchList.request());

    const { data } = yield api.get(`${DATA_SOURCES_PATH}/${dataSourceId}${DATA_WRANGLING_SCRIPTS_PATH}`);

    yield put(DataWranglingScriptsRoutines.fetchList.success(data));
  } catch (e) {
    yield put(DataWranglingScriptsRoutines.fetchList.failure());
  } finally {
    yield put(DataWranglingScriptsRoutines.fetchList.fulfill());
  }
}

function* sendList({ payload: { steps, dataSourceId } }) {
  try {
    yield put(DataWranglingScriptsRoutines.sendList.request());

    yield api.post(`${DATA_SOURCES_PATH}/${dataSourceId}${DATA_WRANGLING_JOB_PATH}`, { steps });

    const dataSource = yield select(selectDataSource);

    browserHistory.push(`/project/${dataSource.project}/datasource/`);
    yield put(DataWranglingScriptsRoutines.sendList.success());
  } catch (e) {
    yield put(DataWranglingScriptsRoutines.sendList.failure());
  } finally {
    yield put(DataWranglingScriptsRoutines.sendList.fulfill());
  }
}

function* uploadScript({ payload: { script, dataSourceId } }) {
  try {
    yield put(DataWranglingScriptsRoutines.uploadScript.request());
    const formData = new FormData();
    const headers = { 'Content-Type': 'multipart/form-data' };

    formData.append('file', script);

    yield api.post(`${DATA_SOURCES_PATH}/${dataSourceId}/script-upload`, formData, { headers });

    yield fetchList({ payload: { dataSourceId } });
    yield put(DataWranglingScriptsRoutines.uploadScript.success());
  } catch (e) {
    yield put(DataWranglingScriptsRoutines.uploadScript.failure());
  } finally {
    yield put(DataWranglingScriptsRoutines.uploadScript.fulfill());
  }
}

function* fetchOne({ payload: { scriptId } }) {
  try {
    yield put(DataWranglingScriptsRoutines.fetchOne.request());

    const { data } = yield api.get(`${DATA_WRANGLING_SCRIPTS_PATH}/${scriptId}`);

    yield put(DataWranglingScriptsRoutines.fetchOne.success(data));
  } catch (error) {
    yield put(DataWranglingScriptsRoutines.fetchOne.failure(error));
  } finally {
    yield put(DataWranglingScriptsRoutines.fetchOne.fulfill());
  }
}

function* setImageScrappingFields({ payload }) {
  try {
    yield put(DataWranglingScriptsRoutines.setImageScrappingFields.request());

    yield put(DataWranglingScriptsRoutines.setImageScrappingFields.success(payload));
    browserHistory.push(`/datasource/${payload.dataSourceId}/3`);
  } catch (error) {
    yield put(DataWranglingScriptsRoutines.setImageScrappingFields.failure(error));
  } finally {
    yield put(DataWranglingScriptsRoutines.setImageScrappingFields.fulfill());
  }
}

export function* watchDataWranglingScripts() {
  yield all([
    takeLatest(DataWranglingScriptsRoutines.fetchList.TRIGGER, fetchList),
    takeLatest(DataWranglingScriptsRoutines.sendList.TRIGGER, sendList),
    takeLatest(DataWranglingScriptsRoutines.uploadScript.TRIGGER, uploadScript),
    takeLatest(DataWranglingScriptsRoutines.fetchOne.TRIGGER, fetchOne),
    takeLatest(DataWranglingScriptsRoutines.setImageScrappingFields.TRIGGER, setImageScrappingFields),
  ]);
}
