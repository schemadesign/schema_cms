import { all, put, takeLatest } from 'redux-saga/effects';

import { JobRoutines } from './job.redux';
import api from '../../shared/services/api';

function* fetchOne({ payload: { jobId } }) {
  try {
    yield put(JobRoutines.fetchOne.request());

    const { data } = yield api.get(`/jobs/${jobId}`);

    yield put(JobRoutines.fetchOne.success(data));
  } catch (e) {
    yield put(JobRoutines.fetchOne.failure(e));
  } finally {
    yield put(JobRoutines.fetchOne.fulfill());
  }
}

export function* watchJob() {
  yield all([takeLatest(JobRoutines.fetchOne.TRIGGER, fetchOne)]);
}
