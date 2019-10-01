import { all, put, takeLatest } from 'redux-saga/effects';

import api from '../../shared/services/api';
import { DataWranglingResultRoutines } from './dataWranglingResult.redux';

function* fetch({ payload }) {
  try {
    yield put(DataWranglingResultRoutines.fetch.request());

    const { data } = yield api.get(`/data-wrangling-result/${payload.dataSourceId}`);

    yield put(DataWranglingResultRoutines.fetch.success(data));
  } catch (error) {
    yield put(DataWranglingResultRoutines.fetch.failure(error));
  } finally {
    yield put(DataWranglingResultRoutines.fetch.fulfill());
  }
}

export function* watchDataWranglingResult() {
  yield all([takeLatest(DataWranglingResultRoutines.fetch.TRIGGER, fetch)]);
}
