import { all, takeLatest, put } from 'redux-saga/effects';
import api from '../../shared/services/api';

import { UserRoutines } from './user.redux';
import { PROJECTS_PATH } from '../../shared/utils/api.constants';
import { ROLES } from '../userProfile/userProfile.constants';
import browserHistory from '../../shared/utils/history';
import { getError } from '../../shared/utils/helpers';

function* createUserCMS({ payload }) {
  try {
    yield put(UserRoutines.createUserCMS.request());

    yield api.post('/users', payload);

    yield put(UserRoutines.createUserCMS.success());
    browserHistory.push('/user');
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
  let response;

  try {
    yield put(UserRoutines.fetchUser.request());

    response = yield api.get(`users/${userId}`);

    const { data } = response;

    yield put(UserRoutines.fetchUser.success(data));
  } catch (error) {
    yield put(UserRoutines.fetchUser.failure(getError(error)));
  } finally {
    yield put(UserRoutines.fetchUser.fulfill());
  }
}

function* makeAdmin({ payload: { userId } }) {
  try {
    yield put(UserRoutines.makeAdmin.request());

    const { data } = yield api.put(`users/${userId}`, { role: ROLES.ADMIN });

    yield put(UserRoutines.makeAdmin.success(data));
  } catch (error) {
    yield put(UserRoutines.makeAdmin.failure());
  } finally {
    yield put(UserRoutines.makeAdmin.fulfill());
  }
}

function* fetchUsers() {
  try {
    yield put(UserRoutines.fetchUsers.request());

    const {
      data: { results },
    } = yield api.get('users?page_size=1000');

    yield put(UserRoutines.fetchUsers.success(results));
  } catch (error) {
    yield put(UserRoutines.fetchUsers.failure());
  } finally {
    yield put(UserRoutines.fetchUsers.fulfill());
  }
}

function* removeUser({ payload: { userId } }) {
  try {
    yield put(UserRoutines.removeUser.request());

    yield api.post(`users/${userId}/deactivate`);

    yield put(UserRoutines.removeUser.success());
    browserHistory.push('/user');
  } catch (error) {
    yield put(UserRoutines.removeUser.failure());
  } finally {
    yield put(UserRoutines.removeUser.fulfill());
  }
}

export function* watchUser() {
  yield all([
    takeLatest(UserRoutines.createUserCMS.TRIGGER, createUserCMS),
    takeLatest(UserRoutines.createUserProject.TRIGGER, createUserProject),
    takeLatest(UserRoutines.fetchUser.TRIGGER, fetchUser),
    takeLatest(UserRoutines.makeAdmin.TRIGGER, makeAdmin),
    takeLatest(UserRoutines.fetchUsers.TRIGGER, fetchUsers),
    takeLatest(UserRoutines.removeUser.TRIGGER, removeUser),
  ]);
}
