import { all, put, select, takeLatest } from 'redux-saga/effects';

import { UserProfileActions, UserProfileRoutines } from './userProfile.redux';
import api from '../../shared/services/api';
import { ME_PATH } from '../../shared/utils/api.constants';
import { selectAuthToken } from '../userAuth';
import { setAuthorizationToken } from '../userAuth/userAuth.sagas';

function* fetchUserDetails() {
  try {
    const token = yield select(selectAuthToken);
    yield setAuthorizationToken(token);

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
  yield all([takeLatest(UserProfileRoutines.fetchUserDetails.TRIGGER, fetchUserDetails)]);
}
