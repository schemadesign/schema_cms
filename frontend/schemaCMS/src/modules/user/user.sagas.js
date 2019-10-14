import { all, takeLatest, put } from 'redux-saga/effects';
import api from '../../shared/services/api';

import { UserRoutines } from './user.redux';
import { PROJECTS_PATH } from '../../shared/utils/api.constants';

function* createUserCMS({ payload }) {
  try {
    yield put(UserRoutines.createUserCMS.request());

    yield api.post('/users', payload);

    yield put(UserRoutines.createUserCMS.success());
  } catch (error) {
    yield put(UserRoutines.createUserCMS.failure());
  } finally {
    yield put(UserRoutines.createUserCMS.fulfill());
  }
}

function* createUserProject({ payload: { projectId, userId } }) {
  try {
    yield put(UserRoutines.createUserProject.request());

    yield api.post(`${PROJECTS_PATH}/${projectId}`, { userId });

    yield put(UserRoutines.createUserProject.success());
  } catch (error) {
    yield put(UserRoutines.createUserProject.failure());
  } finally {
    yield put(UserRoutines.createUserProject.fulfill());
  }
}

function* fetchUser({ payload: { userId } }) {
  try {
    yield put(UserRoutines.fetchUser.request());

    const { data } = yield api.get(`users/${userId}`);

    yield put(UserRoutines.fetchUser.success(data));
  } catch (error) {
    yield put(UserRoutines.fetchUser.failure());
  } finally {
    yield put(UserRoutines.fetchUser.fulfill());
  }
}

export function* watchUser() {
  yield all([
    takeLatest(UserRoutines.createUserCMS.TRIGGER, createUserCMS),
    takeLatest(UserRoutines.createUserProject.TRIGGER, createUserProject),
    takeLatest(UserRoutines.fetchUser.TRIGGER, fetchUser),
  ]);
}
