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

function* updateOne({ payload: { id, description } }) {
  try {
    yield put(JobRoutines.updateOne.request());

    const { data } = yield api.patch(`/jobs/${id}`, { description });

    yield put(JobRoutines.updateOne.success(data));
  } catch (e) {
    yield put(JobRoutines.updateOne.failure(e));
  } finally {
    yield put(JobRoutines.updateOne.fulfill());
  }
}

function* fetchPreview({ payload: { jobId } }) {
  try {
    yield put(JobRoutines.fetchPreview.request());

    const { data } = yield api.get(`/jobs/${jobId}/preview`, { camelize: false });

    yield put(JobRoutines.fetchPreview.success(data));
  } catch (e) {
    yield put(JobRoutines.fetchPreview.failure(e));
  } finally {
    yield put(JobRoutines.fetchPreview.fulfill());
  }
}

export function* watchJob() {
  yield all([
    takeLatest(JobRoutines.fetchOne.TRIGGER, fetchOne),
    takeLatest(JobRoutines.updateOne.TRIGGER, updateOne),
    takeLatest(JobRoutines.fetchPreview.TRIGGER, fetchPreview),
  ]);
}
