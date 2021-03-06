import { all, put, select, takeLatest } from 'redux-saga/effects';

import { UserProfileRoutines } from './userProfile.redux';
import api from '../../shared/services/api';
import { ME_PATH } from '../../shared/utils/api.constants';
import { selectAuthToken } from '../userAuth';
import { setAuthorizationToken } from '../userAuth/userAuth.sagas';
import { EMAIL } from './userProfile.constants';

function* fetchUserDetails() {
  try {
    const token = yield select(selectAuthToken);
    yield setAuthorizationToken(token);

    yield put(UserProfileRoutines.fetchUserDetails.request());

    const { data } = yield api.get(ME_PATH);

    yield put(UserProfileRoutines.fetchUserDetails.success(data));
  } catch (error) {
    yield put(UserProfileRoutines.fetchUserDetails.failure());
  } finally {
    yield put(UserProfileRoutines.fetchUserDetails.fulfill());
  }
}

function* updateMe({ payload }) {
  try {
    yield put(UserProfileRoutines.updateMe.request());
    delete payload[EMAIL];

    const { data } = yield api.patch(ME_PATH, payload);

    yield put(UserProfileRoutines.updateMe.success(data));
  } catch (error) {
    yield put(UserProfileRoutines.updateMe.failure());
  } finally {
    yield put(UserProfileRoutines.updateMe.fulfill());
  }
}

export function* watchUserProfile() {
  yield all([
    takeLatest(UserProfileRoutines.fetchUserDetails.TRIGGER, fetchUserDetails),
    takeLatest(UserProfileRoutines.updateMe.TRIGGER, updateMe),
  ]);
}
