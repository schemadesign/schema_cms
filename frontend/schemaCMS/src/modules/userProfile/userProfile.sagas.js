import { all, put, takeEvery } from 'redux-saga/effects';

import { UserProfileActions, UserProfileRoutines } from './userProfile.redux';
import api from '../../shared/services/api';
import { ME_PATH } from '../../shared/utils/api.constants';

function* resetPassword() {
  try {
    yield put(UserProfileRoutines.resetPassword.request());

    yield api.post('/auth/reset-password/');

    yield put(UserProfileRoutines.resetPassword.success());
  } catch (error) {
    yield put(UserProfileRoutines.resetPassword.failure());
  } finally {
    yield put(UserProfileRoutines.resetPassword.fulfill());
  }
}

function* resendVerificationEmail() {
  try {
    yield put(UserProfileRoutines.resendVerificationEmail.request());

    yield api.post('/auth/resend-verification-email/');

    yield put(UserProfileRoutines.resendVerificationEmail.success());
  } catch (error) {
    yield put(UserProfileRoutines.resendVerificationEmail.failure());
  } finally {
    yield put(UserProfileRoutines.resendVerificationEmail.fulfill());
  }
}

function* fetchUserDetails() {
  try {
    yield put(UserProfileRoutines.fetchUserDetails.request());

    const { data } = yield api.get(ME_PATH);

    yield put(UserProfileRoutines.fetchUserDetails.success(data));
    yield put(UserProfileActions.fetchUserDetailsSuccess(data));
  } catch (error) {
    yield put(UserProfileRoutines.fetchUserDetails.failure(error));
    yield put(UserProfileActions.fetchUserDetailsError());
  } finally {
    yield put(UserProfileRoutines.fetchUserDetails.fulfill());
  }
}

export function* watchUserProfile() {
  yield all([
    takeEvery(UserProfileRoutines.resetPassword.TRIGGER, resetPassword),
    takeEvery(UserProfileRoutines.resendVerificationEmail.TRIGGER, resendVerificationEmail),
    takeEvery(UserProfileRoutines.fetchUserDetails.TRIGGER, fetchUserDetails),
  ]);
}
