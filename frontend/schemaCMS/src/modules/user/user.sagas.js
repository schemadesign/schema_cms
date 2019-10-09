import { all, put, takeLatest } from 'redux-saga/effects';
import reportError from '../../shared/utils/reportError';

import { UserTypes, UserActions } from './user.redux';

export function* watchUser() {
  yield all([]);
}
