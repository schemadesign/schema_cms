import { all, put, takeLatest } from 'redux-saga/effects';

import api from '../../shared/services/api';
import { DataWranglingRoutines } from './dataWrangling.redux';

function* fetchOne({ payload }) {
  try {
    yield put(DataWranglingRoutines.fetchOne.request());

    const { scriptId = 1 } = payload;
    const { data } = yield api.get(`/script/view/${scriptId}`);

    yield put(DataWranglingRoutines.fetchOne.success(data));
  } catch (error) {
    yield put(DataWranglingRoutines.fetchOne.failure(error));
  } finally {
    yield put(DataWranglingRoutines.fetchOne.fulfill());
  }
}

export function* watchDataWrangling() {
  yield all([takeLatest(DataWranglingRoutines.fetchOne.TRIGGER, fetchOne)]);
}
