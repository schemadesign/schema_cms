import { all, put, takeEvery, takeLatest } from 'redux-saga/effects';
import browserHistory from '../../shared/utils/history'
import api from '../../shared/services/api';

import { UserAuthTypes, UserAuthActions, UserAuthRoutines } from './userAuth.redux';

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
    yield takeLatest(UserAuthTypes.LOGOUT, logout),
    yield takeEvery(UserAuthRoutines.resetPassword.TRIGGER, resetPassword),
    yield takeEvery(UserAuthRoutines.resendVerificationEmail.TRIGGER, resendVerificationEmail),
  ]);
}
