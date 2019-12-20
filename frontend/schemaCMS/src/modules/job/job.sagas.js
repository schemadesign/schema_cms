import { all, put, takeLatest } from 'redux-saga/effects';

import { JobRoutines } from './job.redux';
import api from '../../shared/services/api';
import { ProjectRoutines } from '../project';

function* fetchOne({ payload: { jobId } }) {
  try {
    yield put(JobRoutines.fetchOne.request());

    const { data } = yield api.get(`/jobs/${jobId}`);

    yield put(ProjectRoutines.setProject.trigger(data.project));
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

function* fetchJobList({ payload: { dataSourceId } }) {
  try {
    yield put(JobRoutines.fetchJobList.request());

    const {
      data: { results },
    } = yield api.get(`/datasources/${dataSourceId}/jobs-history?page_size=1000`);

    yield put(JobRoutines.fetchJobList.success(results));
  } catch (e) {
    yield put(JobRoutines.fetchJobList.failure(e));
  } finally {
    yield put(JobRoutines.fetchJobList.fulfill());
  }
}

function* fetchPreview({ payload: { jobId } }) {
  try {
    yield put(JobRoutines.fetchPreview.request());

    const { data } = yield api.get(`/jobs/${jobId}/preview`, { camelize: false });

    yield put(ProjectRoutines.setProject.trigger(data.project));
    yield put(JobRoutines.fetchPreview.success(data.results));
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
    takeLatest(JobRoutines.fetchJobList.TRIGGER, fetchJobList),
  ]);
}
