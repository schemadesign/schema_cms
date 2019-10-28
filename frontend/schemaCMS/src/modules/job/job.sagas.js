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

function* updateOne({ payload: { pk: jobId, description } }) {
  try {
    yield put(JobRoutines.updateOne.request());

    yield api.patch(`/jobs/${jobId}`, { description });

    yield fetchOne({
      payload: {
        jobId,
      },
    });

    yield put(JobRoutines.updateOne.success());
  } catch (e) {
    yield put(JobRoutines.updateOne.failure(e));
  } finally {
    yield put(JobRoutines.updateOne.fulfill());
  }
}

export function* watchJob() {
  yield all([takeLatest(JobRoutines.fetchOne.TRIGGER, fetchOne), takeLatest(JobRoutines.updateOne.TRIGGER, updateOne)]);
}
