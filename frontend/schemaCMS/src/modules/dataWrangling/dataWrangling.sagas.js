import { all, put, takeLatest } from 'redux-saga/effects';

import { DataWranglingRoutines } from './dataWrangling.redux';
import api from '../../shared/services/api';
import { DATA_SOURCE_PATH, DATA_WRANGLING_PATH } from '../../shared/utils/api.constants';

function* fetchList({ payload: { dataSourceId } }) {
  try {
    yield put(DataWranglingRoutines.fetchList.request());

    const { data } = yield api.get(`${DATA_SOURCE_PATH}/${dataSourceId}${DATA_WRANGLING_PATH}`);

    yield put(DataWranglingRoutines.fetchList.success(data));
  } catch (e) {
    yield put(DataWranglingRoutines.fetchList.failure());
  } finally {
    yield put(DataWranglingRoutines.fetchList.fulfill());
  }
}

function* sendList({ payload: { list, dataSourceId } }) {
  try {
    yield put(DataWranglingRoutines.sendList.request());

    yield api.put(`${DATA_SOURCE_PATH}/${dataSourceId}${DATA_WRANGLING_PATH}`, { list });

    yield put(DataWranglingRoutines.sendList.success());
  } catch (e) {
    yield put(DataWranglingRoutines.sendList.failure());
  } finally {
    yield put(DataWranglingRoutines.sendList.fulfill());
  }
}

function* uploadScript({ payload: { file, dataSourceId } }) {
  try {
    yield put(DataWranglingRoutines.uploadScript.request());
    const formData = new FormData();
    const headers = { 'Content-Type': 'multipart/form-data' };

    formData.append('file', file);

    yield api.put(`${DATA_SOURCE_PATH}/${dataSourceId}/script`, formData, { headers });

    yield put(DataWranglingRoutines.fetchList({ dataSourceId }));
    yield put(DataWranglingRoutines.uploadScript.success());
  } catch (e) {
    yield put(DataWranglingRoutines.uploadScript.failure());
  } finally {
    yield put(DataWranglingRoutines.uploadScript.fulfill());
  }
}

function* fetchOne({ payload }) {
  try {
    yield put(DataWranglingRoutines.fetchOne.request());

    const { scriptId = 1 } = payload;
    const { data } = yield api.get(`/script/view/${scriptId}`);

    yield put(DataWranglingRoutines.fetchOne.success(data));
  } catch (error) {
    yield put(DataWranglingRoutines.fetchOne.failure(error));
  } finally {
    yield put(DataWranglingRoutines.fetchOne.fulfill());
  }
}

export function* watchDataWrangling() {
  yield all([
    takeLatest(DataWranglingRoutines.fetchList.TRIGGER, fetchList),
    takeLatest(DataWranglingRoutines.sendList.TRIGGER, sendList),
    takeLatest(DataWranglingRoutines.uploadScript.TRIGGER, uploadScript),
    takeLatest(DataWranglingRoutines.fetchOne.TRIGGER, fetchOne),
  ]);
}
