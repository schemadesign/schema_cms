import { all, put, takeLatest } from 'redux-saga/effects';
import { pipe, forEach, keys } from 'ramda';

import { DataSourceRoutines } from './dataSource.redux';
import browserHistory from '../../shared/utils/history';
import api from '../../shared/services/api';
import { DATA_SOURCE_PATH, PROJECTS_PATH } from '../../shared/utils/api.constants';

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

function* fetchList({ payload }) {
  try {
    yield put(DataSourceRoutines.fetchList.request());

    const { data } = yield api.get(`${PROJECTS_PATH}/${payload.projectId}${DATA_SOURCE_PATH}`);

    yield put(DataSourceRoutines.fetchList.success(data.results));
  } catch (error) {
    yield put(DataSourceRoutines.fetchList.failure(error));
  } finally {
    yield put(DataSourceRoutines.fetchList.fulfill());
  }
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

export function* watchDataSource() {
  yield all([
    takeLatest(DataSourceRoutines.create.TRIGGER, create),
    takeLatest(DataSourceRoutines.removeOne.TRIGGER, removeOne),
    takeLatest(DataSourceRoutines.fetchOne.TRIGGER, fetchOne),
    takeLatest(DataSourceRoutines.updateOne.TRIGGER, updateOne),
    takeLatest(DataSourceRoutines.processOne.TRIGGER, processOne),
    takeLatest(DataSourceRoutines.fetchList.TRIGGER, fetchList),
  ]);
}
