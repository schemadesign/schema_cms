import { all, put, takeLatest } from 'redux-saga/effects';
import reportError from '../../shared/utils/reportError';

import { AppConfigTypes, AppConfigActions } from './appConfig.redux';

export function* watchAppConfig() {
  yield all([]);
}
