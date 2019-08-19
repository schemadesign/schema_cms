import { all, put, takeEvery, takeLatest } from 'redux-saga/effects';
import browserHistory from '../../shared/utils/history';
import api from '../../shared/services/api';

import { UserAuthTypes, UserAuthActions, UserAuthRoutines } from './userAuth.redux';
import { StartupTypes } from '../startup/startup.redux';
import { AUTH_PATH, TOKEN_PATH, USER_PATH } from '../../shared/utils/api.constants';

function* setAuthorizationToken(token) {
  if (token) {
    api.defaults.headers.common['X-Authorization'] = `JWT ${token}`;
  }
}

function* redirectExternal(path) {
  window.location.href = path;
}

function* getJwtToken({ uid, token }) {
  const { JWT } = yield api.post(TOKEN_PATH, {
    uid,
    token,
  });

  yield setAuthorizationToken(JWT);
}

function* fetchUserDetails() {
  yield put(UserAuthRoutines.fetchUserDetails.request());

  const { data } = yield api.get(USER_PATH);

  yield put(UserAuthRoutines.fetchUserDetails.success(data));
}

function* startup() {
  try {
    yield fetchUserDetails();
  } catch (error) {
    yield redirectExternal(`${AUTH_PATH}?next=http://localhost:3000/jwt/`);
  }
}

function* logout() {
  yield api.post('/auth/logout/');

  yield put(UserAuthActions.logoutSuccess());

  browserHistory.push('/');
}

function* resetPassword() {
  try {
    yield put(UserAuthRoutines.resetPassword.request());

    yield api.post('/auth/reset-password/');

    yield put(UserAuthRoutines.resetPassword.success());
  } catch (error) {
    yield put(UserAuthRoutines.resetPassword.failure());
  } finally {
    yield put(UserAuthRoutines.resetPassword.fulfill());
  }
}

function* resendVerificationEmail() {
  try {
    yield put(UserAuthRoutines.resendVerificationEmail.request());

    yield api.post('/auth/resend-verification-email/');

    yield put(UserAuthRoutines.resendVerificationEmail.success());
  } catch (error) {
    yield put(UserAuthRoutines.resendVerificationEmail.failure());
  } finally {
    yield put(UserAuthRoutines.resendVerificationEmail.fulfill());
  }
}

export function* watchUserAuth() {
  yield all([
    takeLatest(UserAuthTypes.LOGOUT, logout),
    takeEvery(UserAuthRoutines.resetPassword.TRIGGER, resetPassword),
    takeEvery(UserAuthRoutines.resendVerificationEmail.TRIGGER, resendVerificationEmail),
    takeLatest(StartupTypes.STARTUP, startup),
    takeLatest(UserAuthTypes.GET_JWT_TOKEN, getJwtToken),
  ]);
}
