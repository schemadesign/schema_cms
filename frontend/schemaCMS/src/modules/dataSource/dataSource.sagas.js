import { all, put, takeLatest, take, delay, fork, cancel, cancelled } from 'redux-saga/effects';
import { pipe, forEach, keys, any, anyPass, propEq } from 'ramda';

import { DataSourceRoutines } from './dataSource.redux';
import browserHistory from '../../shared/utils/history';
import api from '../../shared/services/api';
import { DATA_SOURCE_PATH, PREVIEW_PATH, PROJECTS_PATH } from '../../shared/utils/api.constants';
import { FETCH_LIST_DELAY, STATUS_PROCESSING, STATUS_READY_FOR_PROCESSING } from './dataSource.constants';

function* create({ payload }) {
  try {
    yield put(DataSourceRoutines.create.request());

    const requestData = { project: payload.projectId };
    const { data } = yield api.post(`${PROJECTS_PATH}/${payload.projectId}${DATA_SOURCE_PATH}`, requestData);

    browserHistory.push(`/project/view/${payload.projectId}/datasource/view/${data.id}`);
    yield put(DataSourceRoutines.create.success(data));
  } catch (error) {
    yield put(DataSourceRoutines.create.failure(error));
  } finally {
    yield put(DataSourceRoutines.create.fulfill());
  }
}

function* removeOne({ payload }) {
  try {
    yield put(DataSourceRoutines.removeOne.request());
    yield api.delete(`${PROJECTS_PATH}/${payload.projectId}${DATA_SOURCE_PATH}/${payload.dataSourceId}`);

    browserHistory.push(`/project/view/${payload.projectId}/datasource/list`);
    yield put(DataSourceRoutines.removeOne.success());
  } catch (error) {
    yield put(DataSourceRoutines.removeOne.failure(error));
  } finally {
    yield put(DataSourceRoutines.removeOne.fulfill());
  }
}

function* fetchOne({ payload }) {
  try {
    yield put(DataSourceRoutines.fetchOne.request());

    const { data } = yield api.get(`${PROJECTS_PATH}/${payload.projectId}${DATA_SOURCE_PATH}/${payload.dataSourceId}`);

    yield put(DataSourceRoutines.fetchOne.success(data));
  } catch (error) {
    yield put(DataSourceRoutines.fetchOne.failure(error));
  } finally {
    yield put(DataSourceRoutines.fetchOne.fulfill());
  }
}

const getIfAnyResultProcessing = any(
  anyPass([propEq('status', STATUS_READY_FOR_PROCESSING), propEq('status', STATUS_PROCESSING)])
);

function* fetchListLoop(payload) {
  try {
    while (true) {
      yield put(DataSourceRoutines.fetchList.request());

      const { data } = yield api.get(`${PROJECTS_PATH}/${payload.projectId}${DATA_SOURCE_PATH}`);

      yield put(DataSourceRoutines.fetchList.success(data.results));

      if (!getIfAnyResultProcessing(data.results)) {
        yield cancel();
      }

      yield delay(FETCH_LIST_DELAY);
    }
  } catch (error) {
    yield put(DataSourceRoutines.fetchList.failure(error));
  } finally {
    if (yield cancelled()) {
      yield put(DataSourceRoutines.fetchList.fulfill());
    }
  }
}

function* fetchList({ payload }) {
  const bgSyncTask = yield fork(fetchListLoop, payload);

  yield take(DataSourceRoutines.cancelFetchListLoop.TRIGGER);
  yield cancel(bgSyncTask);
}

function* updateOne({ payload: { projectId, dataSourceId, requestData, step } }) {
  try {
    yield put(DataSourceRoutines.updateOne.request());
    const formData = new FormData();

    pipe(
      keys,
      forEach(name => formData.append(name, requestData[name]))
    )(requestData);

    const { data } = yield api.patch(`${PROJECTS_PATH}/${projectId}${DATA_SOURCE_PATH}/${dataSourceId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const redirectUri = requestData.file ? 'list' : `view/${dataSourceId}/${parseInt(step, 10) + 1}`;

    browserHistory.push(`/project/view/${projectId}/datasource/${redirectUri}`);

    yield put(DataSourceRoutines.updateOne.success(data));
    yield put(DataSourceRoutines.processOne({ projectId, dataSourceId }));
  } catch (error) {
    yield put(DataSourceRoutines.updateOne.failure(error));
  } finally {
    yield put(DataSourceRoutines.updateOne.fulfill());
  }
}

function* processOne({ payload: { projectId, dataSourceId } }) {
  try {
    yield put(DataSourceRoutines.processOne.request());
    yield api.post(`${PROJECTS_PATH}/${projectId}${DATA_SOURCE_PATH}/${dataSourceId}/process`);
    yield put(DataSourceRoutines.processOne.success());
  } catch (error) {
    yield put(DataSourceRoutines.processOne.failure());
  } finally {
    yield put(DataSourceRoutines.processOne.fulfill());
  }
}

function* fetchFields({ payload }) {
  try {
    yield put(DataSourceRoutines.fetchOne.request());

    const { projectId, dataSourceId } = payload;
    const { data } = yield api.get(`${PROJECTS_PATH}/${projectId}${DATA_SOURCE_PATH}/${dataSourceId}${PREVIEW_PATH}`);

    yield put(DataSourceRoutines.fetchFields.success(data));
  } catch (error) {
    yield put(DataSourceRoutines.fetchFields.failure(error));
  } finally {
    yield put(DataSourceRoutines.fetchFields.fulfill());
  }
}

export function* watchDataSource() {
  yield all([
    takeLatest(DataSourceRoutines.create.TRIGGER, create),
    takeLatest(DataSourceRoutines.removeOne.TRIGGER, removeOne),
    takeLatest(DataSourceRoutines.fetchOne.TRIGGER, fetchOne),
    takeLatest(DataSourceRoutines.updateOne.TRIGGER, updateOne),
    takeLatest(DataSourceRoutines.processOne.TRIGGER, processOne),
    takeLatest(DataSourceRoutines.fetchList.TRIGGER, fetchList),
    takeLatest(DataSourceRoutines.fetchFields.TRIGGER, fetchFields),
  ]);
}
