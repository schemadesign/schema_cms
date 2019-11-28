import { all, put, takeLatest } from 'redux-saga/effects';

import { FolderRoutines } from './folder.redux';
import api from '../../shared/services/api';
import { PROJECTS_PATH, FOLDERS_PATH } from '../../shared/utils/api.constants';
import browserHistory from '../../shared/utils/history';

function* fetchList({ payload: { projectId } }) {
  try {
    yield put(FolderRoutines.fetchList.request());

    const { data } = yield api.get(`${PROJECTS_PATH}/${projectId}${FOLDERS_PATH}`);

    yield put(FolderRoutines.fetchList.success(data));
  } catch (e) {
    yield put(FolderRoutines.fetchList.failure(e));
  } finally {
    yield put(FolderRoutines.fetchList.fulfill());
  }
}

function* fetchOne({ payload: { folderId } }) {
  try {
    yield put(FolderRoutines.fetchOne.request());

    const { data } = yield api.get(`${FOLDERS_PATH}/${folderId}`);

    yield put(FolderRoutines.fetchOne.success(data));
  } catch (e) {
    yield put(FolderRoutines.fetchOne.failure(e));
  } finally {
    yield put(FolderRoutines.fetchOne.fulfill());
  }
}

function* create({ payload: { projectId, name } }) {
  try {
    yield put(FolderRoutines.create.request());

    const { data } = yield api.post(`${PROJECTS_PATH}/${projectId}${FOLDERS_PATH}`, { name });

    yield put(FolderRoutines.create.success(data));
    browserHistory.push(`/project/${projectId}/folder`);
  } catch (e) {
    yield put(FolderRoutines.create.failure(e));
  } finally {
    yield put(FolderRoutines.create.fulfill());
  }
}

function* update({ payload: { folderId, projectId, name } }) {
  try {
    yield put(FolderRoutines.update.request());

    const { data } = yield api.patch(`${FOLDERS_PATH}/${folderId}`, { name });

    yield put(FolderRoutines.update.success(data));
    browserHistory.push(`/project/${projectId}/folder`);
  } catch (e) {
    yield put(FolderRoutines.update.failure(e));
  } finally {
    yield put(FolderRoutines.update.fulfill());
  }
}

function* removeOne({ payload: { folderId, projectId } }) {
  try {
    yield put(FolderRoutines.update.request());

    yield api.delete(`${FOLDERS_PATH}/${folderId}`);

    yield put(FolderRoutines.update.success());
    browserHistory.push(`/project/${projectId}/folder`);
  } catch (e) {
    yield put(FolderRoutines.update.failure(e));
  } finally {
    yield put(FolderRoutines.update.fulfill());
  }
}

export function* watchFolder() {
  yield all([
    takeLatest(FolderRoutines.fetchList.TRIGGER, fetchList),
    takeLatest(FolderRoutines.fetchOne.TRIGGER, fetchOne),
    takeLatest(FolderRoutines.create.TRIGGER, create),
    takeLatest(FolderRoutines.update.TRIGGER, update),
    takeLatest(FolderRoutines.removeOne.TRIGGER, removeOne),
  ]);
}
