import { all, put, takeLatest } from 'redux-saga/effects';

import { DataWrangligResultRoutines } from './dataWranglingResult.redux';

function* fetch({ payload }) {
  try {
    yield put(DataWrangligResultRoutines.fetchOne.request());

    const { data } = yield api.get(`data-wrangling-result/${payload.dataSourceId}`);

    yield put(DataWrangligResultRoutines.fetch.success(data));
  } catch (error) {
    yield put(DataWrangligResultRoutines.fetch.failure(error));
  } finally {
    yield put(DataWrangligResultRoutines.fetch.fulfill());
  }
}

export function* watchDataWranglingResult() {
  yield all([takeLatest(DataWrangligResultRoutines.fetch.TRIGGER, fetch)]);
}
