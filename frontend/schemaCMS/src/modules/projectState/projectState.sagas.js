import { all, put, takeLatest } from 'redux-saga/effects';
import reportError from '../../shared/utils/reportError';

import { ProjectStateRoutines } from './projectState.redux';
import api from '../../shared/services/api';
import { PROJECTS_PATH, STATES_PATH } from '../../shared/utils/api.constants';
import browserHistory from '../../shared/utils/history';

function* fetchList({ payload: { projectId } }) {
  try {
    yield put(ProjectStateRoutines.fetchList.request());

    const { data } = yield api.get(`${PROJECTS_PATH}/${projectId}${STATES_PATH}`);

    yield put(ProjectStateRoutines.fetchList.success(data.results));
  } catch (e) {
    reportError(e);
    yield put(ProjectStateRoutines.fetchList.failure(e));
  } finally {
    yield put(ProjectStateRoutines.fetchList.fulfill());
  }
}

function* fetchOne({ payload: { stateId } }) {
  try {
    yield put(ProjectStateRoutines.fetchOne.request());

    const { data } = yield api.get(`${STATES_PATH}/${stateId}`);

    yield put(ProjectStateRoutines.fetchOne.success(data.results));
  } catch (e) {
    reportError(e);
    yield put(ProjectStateRoutines.fetchOne.failure(e));
  } finally {
    yield put(ProjectStateRoutines.fetchOne.fulfill());
  }
}

function* create({ payload: { projectId, formData } }) {
  try {
    yield put(ProjectStateRoutines.create.request());

    const { data } = yield api.post(`${PROJECTS_PATH}/${projectId}${STATES_PATH}`, formData);
    yield put(ProjectStateRoutines.create.success(data));

    browserHistory.push(`/state/${data.id}/tags`);
  } catch (e) {
    reportError(e);
    yield put(ProjectStateRoutines.create.failure(e));
  } finally {
    yield put(ProjectStateRoutines.create.fulfill());
  }
}

function* update({ payload: { stateId, formData, redirectUrl } }) {
  try {
    yield put(ProjectStateRoutines.update.request());

    const { data } = yield api.patch(`${STATES_PATH}/${stateId}`, formData);

    yield put(ProjectStateRoutines.update.success(data));

    browserHistory.push(redirectUrl);
  } catch (e) {
    reportError(e);
    yield put(ProjectStateRoutines.update.failure(e));
  } finally {
    yield put(ProjectStateRoutines.update.fulfill());
  }
}

function* remove({ payload: { stateId, projectId } }) {
  try {
    yield put(ProjectStateRoutines.remove.request());

    yield api.delete(`${STATES_PATH}/${stateId}`);
    yield put(ProjectStateRoutines.remove.success());

    browserHistory.push(`/project/${projectId}/state`);
  } catch (e) {
    reportError(e);
    yield put(ProjectStateRoutines.remove.failure(e));
  } finally {
    yield put(ProjectStateRoutines.remove.fulfill());
  }
}

export function* watchProjectState() {
  yield all([
    takeLatest(ProjectStateRoutines.fetchList.TRIGGER, fetchList),
    takeLatest(ProjectStateRoutines.fetchOne.TRIGGER, fetchOne),
    takeLatest(ProjectStateRoutines.create.TRIGGER, create),
    takeLatest(ProjectStateRoutines.update.TRIGGER, update),
    takeLatest(ProjectStateRoutines.remove.TRIGGER, remove),
  ]);
}
