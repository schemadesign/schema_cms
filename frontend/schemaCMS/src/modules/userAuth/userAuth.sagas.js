import { all, put, takeEvery, takeLatest } from 'redux-saga/effects';
import browserHistory from '../../shared/utils/history';
import api from '../../shared/services/api';

import { UserAuthTypes, UserAuthActions, UserAuthRoutines } from './userAuth.redux';
import { StartupTypes } from '../startup/startup.redux';
import { TOKEN_PATH, ME_PATH } from '../../shared/utils/api.constants';

function* setAuthorizationToken(token) {
  if (token) {
    api.defaults.headers.common['X-Authorization'] = `JWT ${token}`;
  }
}

function* redirectExternal(path) {
  window.location.href = path;
}

function* getJwtToken({ uid, token }) {
  const { token: jwt } = yield api.post(TOKEN_PATH, {
    uid,
    token,
  });

  yield setAuthorizationToken(jwt);
  yield fetchUserDetails();
}

function* fetchUserDetails() {
  try {
    yield put(UserAuthRoutines.fetchUserDetails.request());

    const { data } = yield api.get(ME_PATH);

    yield put(UserAuthRoutines.fetchUserDetails.success(data));
  } catch (error) {
    yield put(UserAuthRoutines.fetchUserDetails.failure(error));
    yield put(UserAuthActions.fetchUserDetailsError());
  } finally {
    yield put(UserAuthRoutines.fetchUserDetails.fulfill());
  }
}

function* startup() {
  yield fetchUserDetails();
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
