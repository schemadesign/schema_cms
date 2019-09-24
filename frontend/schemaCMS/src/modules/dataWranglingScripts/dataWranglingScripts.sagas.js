import { all, put, takeLatest, select } from 'redux-saga/effects';

import { DataWranglingScriptsRoutines } from './dataWranglingScripts.redux';
import api from '../../shared/services/api';
import {
  DATA_SOURCE_PATH,
  DATA_WRANGLING_JOB_PATH,
  DATA_WRANGLING_SCRIPTS_PATH,
} from '../../shared/utils/api.constants';
import browserHistory from '../../shared/utils/history';

import { selectDataWranglings } from './dataWranglingScripts.selectors';

function* fetchList({ payload: { dataSourceId } }) {
  try {
    yield put(DataWranglingScriptsRoutines.fetchList.request());

    const { data } = yield api.get(`${DATA_SOURCE_PATH}/${dataSourceId}${DATA_WRANGLING_SCRIPTS_PATH}`);

    yield put(DataWranglingScriptsRoutines.fetchList.success(data));
  } catch (e) {
    yield put(DataWranglingScriptsRoutines.fetchList.failure());
  } finally {
    yield put(DataWranglingScriptsRoutines.fetchList.fulfill());
  }
}

function* sendList({ payload: { steps, dataSourceId, projectId } }) {
  try {
    yield put(DataWranglingScriptsRoutines.sendList.request());

    yield api.put(`${DATA_SOURCE_PATH}/${dataSourceId}${DATA_WRANGLING_JOB_PATH}`, { steps });

    browserHistory.push(`/project/view/${projectId}/datasource/list`);
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

    formData.append('script', script);

    yield api.post(`${DATA_SOURCE_PATH}/${dataSourceId}/script-upload`, formData, { headers });

    yield put(DataWranglingScriptsRoutines.fetchList({ dataSourceId }));
    yield put(DataWranglingScriptsRoutines.uploadScript.success());
  } catch (e) {
    yield put(DataWranglingScriptsRoutines.uploadScript.failure());
  } finally {
    yield put(DataWranglingScriptsRoutines.uploadScript.fulfill());
  }
}

function* fetchOne({ payload }) {
  try {
    yield put(DataWranglingScriptsroutines.fetchOne.request());

    let scripts = yield select(selectDataWranglings);

    //TODO: fetch a single script by script ID only
    if (!scripts.length) {
      yield fetchList({ payload });
      scripts = yield select(selectDataWranglings);
    }
    const data = scripts[payload.scriptId];

    yield put(DataWranglingScriptsroutines.fetchOne.success(data));
  } catch (error) {
    yield put(DataWranglingScriptsroutines.fetchOne.failure(error));
  } finally {
    yield put(DataWranglingScriptsroutines.fetchOne.fulfill());
  }
}

export function* watchDataWranglingScripts() {
  yield all([
    takeLatest(DataWranglingScriptsRoutines.fetchList.TRIGGER, fetchList),
    takeLatest(DataWranglingScriptsRoutines.sendList.TRIGGER, sendList),
    takeLatest(DataWranglingScriptsRoutines.uploadScript.TRIGGER, uploadScript),
    takeLatest(DataWranglingScriptsRoutines.fetchOne.TRIGGER, fetchOne),
  ]);
}
