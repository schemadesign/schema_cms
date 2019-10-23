import { all, put, takeLatest, select } from 'redux-saga/effects';
import browserHistory from '../../shared/utils/history';
import api from '../../shared/services/api';

import { UserAuthTypes, UserAuthActions } from './userAuth.redux';
import { StartupTypes } from '../startup/startup.redux';
import { LOGOUT_URL, RESET_PASSWORD_PATH, TOKEN_PATH } from '../../shared/utils/api.constants';
import { selectAuthToken } from './userAuth.selectors';
import { UserProfileRoutines, UserProfileActions } from '../userProfile/userProfile.redux';

export function* setAuthorizationToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `JWT ${token}`;
  }
}

function* getJwtToken({ uid, token }) {
  const { data } = yield api.post(TOKEN_PATH, {
    uid,
    token,
  });

  yield setAuthorizationToken(data.token);
  yield put(UserAuthActions.getJwtTokenSuccess(data.token));
  yield put(UserProfileRoutines.fetchUserDetails());
  browserHistory.push('/');
}

function* startup() {
  yield put(UserProfileActions.clearUserDetails());
  const token = yield select(selectAuthToken);
  yield setAuthorizationToken(token);
}

function* logout() {
  api.defaults.headers.common.Authorization = null;
  yield put(UserProfileActions.clearUserDetails());

  yield put(UserAuthActions.logoutSuccess());

  window.location.assign(LOGOUT_URL);
}

function* resetPassword() {
  const { ticket } = yield api.get(RESET_PASSWORD_PATH);

  yield put(UserProfileActions.clearUserDetails());
  yield redirectExternal(ticket);
}

export function* watchUserAuth() {
  yield all([
    takeLatest(UserAuthTypes.LOGOUT, logout),
    takeLatest(StartupTypes.STARTUP, startup),
    takeLatest(UserAuthTypes.GET_JWT_TOKEN, getJwtToken),
    takeLatest(UserAuthTypes.RESET_PASSWORD, resetPassword),
  ]);
}
