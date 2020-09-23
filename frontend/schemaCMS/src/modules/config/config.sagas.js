import { all, put, takeLatest } from 'redux-saga/effects';
import api from '../../shared/services/api';

import { ConfigRoutines } from './config.redux';
import reportError from '../../shared/utils/reportError';

function* fetchConfig() {
  try {
    yield put(ConfigRoutines.fetchConfig.request());
    const { data } = yield api.get('config');
    yield put(ConfigRoutines.fetchConfig.success(data));
  } catch (e) {
    reportError(e);
    yield put(ConfigRoutines.fetchConfig.failure(e));
  }
}

export function* watchConfig() {
  yield all([takeLatest(ConfigRoutines.fetchConfig.TRIGGER, fetchConfig)]);
}
