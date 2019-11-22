import { all, put, takeLatest } from 'redux-saga/effects';

import { DirectoryRoutines } from './directory.redux';
import api from '../../shared/services/api';
import { PROJECTS_PATH, DIRECTORIES_PATH } from '../../shared/utils/api.constants';
import browserHistory from '../../shared/utils/history';

function* fetchList({ payload: { projectId } }) {
  try {
    yield put(DirectoryRoutines.fetchList.request());

    const { data } = yield api.get(`${PROJECTS_PATH}/${projectId}${DIRECTORIES_PATH}`);

    yield put(DirectoryRoutines.fetchList.success(data));
  } catch (e) {
    yield put(DirectoryRoutines.fetchList.failure(e));
  } finally {
    yield put(DirectoryRoutines.fetchList.fulfill());
  }
}

function* fetchOne({ payload: { directoryId } }) {
  try {
    yield put(DirectoryRoutines.fetchOne.request());

    const { data } = yield api.get(`${DIRECTORIES_PATH}/${directoryId}`);

    yield put(DirectoryRoutines.fetchOne.success(data));
  } catch (e) {
    yield put(DirectoryRoutines.fetchOne.failure(e));
  } finally {
    yield put(DirectoryRoutines.fetchOne.fulfill());
  }
}

function* create({ payload: { projectId, name } }) {
  try {
    yield put(DirectoryRoutines.create.request());

    const { data } = yield api.post(`${PROJECTS_PATH}/${projectId}${DIRECTORIES_PATH}`, { name });

    yield put(DirectoryRoutines.create.success(data));
    browserHistory.push(`/project/${projectId}/directory`);
  } catch (e) {
    yield put(DirectoryRoutines.create.failure(e));
  } finally {
    yield put(DirectoryRoutines.create.fulfill());
  }
}

function* update({ payload: { directoryId, projectId, name } }) {
  try {
    yield put(DirectoryRoutines.update.request());

    const { data } = yield api.patch(`${DIRECTORIES_PATH}/${directoryId}`, { name });

    yield put(DirectoryRoutines.update.success(data));
    browserHistory.push(`/project/${projectId}/directory`);
  } catch (e) {
    yield put(DirectoryRoutines.update.failure(e));
  } finally {
    yield put(DirectoryRoutines.update.fulfill());
  }
}

export function* watchDirectory() {
  yield all([
    takeLatest(DirectoryRoutines.fetchList.TRIGGER, fetchList),
    takeLatest(DirectoryRoutines.fetchOne.TRIGGER, fetchOne),
    takeLatest(DirectoryRoutines.create.TRIGGER, create),
    takeLatest(DirectoryRoutines.update.TRIGGER, update),
  ]);
}
