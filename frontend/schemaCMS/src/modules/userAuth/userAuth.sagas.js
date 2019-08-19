import { all, put, takeEvery, takeLatest, select } from 'redux-saga/effects';
import browserHistory from '../../shared/utils/history'
import api from '../../shared/services/api';

import { UserAuthTypes, UserAuthActions, UserAuthRoutines } from './userAuth.redux';
import { selectUser } from './userAuth.selectors';
import { StartupTypes } from './startup.redux';

function* startup() {
  yield put(UserAuthRoutines.fetchUserDetails.request());
  const user = yield select(selectUser);

  if (!user) {
    yield put(UserAuthRoutines.fetchUserDetails.failure());
    return yield history.push('/auth/login/auth0');
  }

  const { data } = yield api.get('/user/');

  yield put(UserAuthRoutines.fetchUserDetails.success(data));
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
  ]);
}
