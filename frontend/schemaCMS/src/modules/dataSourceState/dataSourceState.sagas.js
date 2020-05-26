import { all, put, takeLatest } from 'redux-saga/effects';
import reportError from '../../shared/utils/reportError';

import { DataSourceStateRoutines } from './dataSourceState.redux';
import api from '../../shared/services/api';
import { DATA_SOURCES_PATH, STATES_PATH } from '../../shared/utils/api.constants';
import browserHistory from '../../shared/utils/history';
import { ProjectRoutines } from '../project';

function* fetchList({ payload: { dataSourceId } }) {
  try {
    yield put(DataSourceStateRoutines.fetchList.request());

    const { data } = yield api.get(`${DATA_SOURCES_PATH}/${dataSourceId}${STATES_PATH}`);

    yield put(DataSourceStateRoutines.fetchList.success(data.results));
  } catch (e) {
    reportError(e);
    yield put(DataSourceStateRoutines.fetchList.failure(e));
  } finally {
    yield put(DataSourceStateRoutines.fetchList.fulfill());
  }
}

function* fetchOne({ payload: { stateId } }) {
  try {
    yield put(DataSourceStateRoutines.fetchOne.request());

    const { data } = yield api.get(`${STATES_PATH}/${stateId}`);

    yield put(ProjectRoutines.setProject(data.project));
    yield put(DataSourceStateRoutines.fetchOne.success(data.results));
  } catch (e) {
    reportError(e);
    yield put(DataSourceStateRoutines.fetchOne.failure(e));
  } finally {
    yield put(DataSourceStateRoutines.fetchOne.fulfill());
  }
}

function* create({ payload: { dataSourceId, formData } }) {
  try {
    yield put(DataSourceStateRoutines.create.request());

    const { data } = yield api.post(`${DATA_SOURCES_PATH}/${dataSourceId}${STATES_PATH}`, formData);
    yield put(DataSourceStateRoutines.create.success(data));

    browserHistory.push(`/state/${data.id}/tags`);
  } catch (e) {
    reportError(e);
    yield put(DataSourceStateRoutines.create.failure(e));
  } finally {
    yield put(DataSourceStateRoutines.create.fulfill());
  }
}

function* update({ payload: { stateId, formData } }) {
  try {
    yield put(DataSourceStateRoutines.update.request());

    const { data } = yield api.patch(`${STATES_PATH}/${stateId}`, formData);

    yield put(DataSourceStateRoutines.update.success(data));
  } catch (e) {
    reportError(e);
    yield put(DataSourceStateRoutines.update.failure(e));
  } finally {
    yield put(DataSourceStateRoutines.update.fulfill());
  }
}

function* remove({ payload: { stateId, dataSourceId } }) {
  try {
    yield put(DataSourceStateRoutines.remove.request());

    yield api.delete(`${STATES_PATH}/${stateId}`);
    yield put(DataSourceStateRoutines.remove.success());

    browserHistory.push(`/datasources/${dataSourceId}/state`);
  } catch (e) {
    reportError(e);
    yield put(DataSourceStateRoutines.remove.failure(e));
  } finally {
    yield put(DataSourceStateRoutines.remove.fulfill());
  }
}

export function* watchDataSourceState() {
  yield all([
    takeLatest(DataSourceStateRoutines.fetchList.TRIGGER, fetchList),
    takeLatest(DataSourceStateRoutines.fetchOne.TRIGGER, fetchOne),
    takeLatest(DataSourceStateRoutines.create.TRIGGER, create),
    takeLatest(DataSourceStateRoutines.update.TRIGGER, update),
    takeLatest(DataSourceStateRoutines.remove.TRIGGER, remove),
  ]);
}
