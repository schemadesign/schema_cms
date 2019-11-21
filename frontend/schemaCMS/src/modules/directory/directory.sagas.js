import { all, put, takeLatest } from 'redux-saga/effects';

import { DirectoryRoutines } from './directory.redux';
import api from '../../shared/services/api';
import { PROJECTS_PATH, DIRECTORIES_PATH } from '../../shared/utils/api.constants';

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

function* create({ payload: { projectId, name } }) {
  try {
    yield put(DirectoryRoutines.create.request());

    const { data } = yield api.post(`${PROJECTS_PATH}/${projectId}${DIRECTORIES_PATH}`, { name });

    yield put(DirectoryRoutines.create.success(data));
  } catch (e) {
    yield put(DirectoryRoutines.create.failure(e));
  } finally {
    yield put(DirectoryRoutines.create.fulfill());
  }
}

export function* watchDirectory() {
  yield all([
    takeLatest(DirectoryRoutines.fetchList.TRIGGER, fetchList),
    takeLatest(DirectoryRoutines.create.TRIGGER, create),
  ]);
}
