import { all, put, takeLatest, take, delay, fork, cancel, cancelled } from 'redux-saga/effects';
import { pipe, forEach, keys, any, propEq, omit, isEmpty, filter, not, propOr, either } from 'ramda';

import { DataSourceRoutines } from './dataSource.redux';
import browserHistory from '../../shared/utils/history';
import api from '../../shared/services/api';
import { DATA_SOURCES_PATH, PREVIEW_PATH, PROJECTS_PATH } from '../../shared/utils/api.constants';
import { FETCH_LIST_DELAY } from './dataSource.constants';
import { JOB_STATE_PENDING, JOB_STATE_PROCESSING } from '../job/job.constants';

const PAGE_SIZE = 1000;

function* create({ payload }) {
  try {
    yield put(DataSourceRoutines.create.request());

    const requestData = { project: payload.projectId };
    const { data } = yield api.post(`${DATA_SOURCES_PATH}`, requestData);

    browserHistory.push(`/datasource/${data.id}`);
    yield put(DataSourceRoutines.create.success(data));
  } catch (error) {
    yield put(DataSourceRoutines.create.failure(error));
  } finally {
    yield put(DataSourceRoutines.create.fulfill());
  }
}

function* removeOne({ payload }) {
  try {
    yield put(DataSourceRoutines.removeOne.request());
    yield api.delete(`${DATA_SOURCES_PATH}/${payload.dataSourceId}`);

    browserHistory.push(`/project/${payload.projectId}/datasource`);
    yield put(DataSourceRoutines.removeOne.success());
  } catch (error) {
    yield put(DataSourceRoutines.removeOne.failure(error));
  } finally {
    yield put(DataSourceRoutines.removeOne.fulfill());
  }
}

function* fetchOne({ payload: { dataSourceId } }) {
  try {
    yield put(DataSourceRoutines.fetchOne.request());

    const { data } = yield api.get(`${DATA_SOURCES_PATH}/${dataSourceId}`);

    yield put(DataSourceRoutines.fetchOne.success(data));
  } catch (error) {
    yield put(DataSourceRoutines.fetchOne.failure(error));
  } finally {
    yield put(DataSourceRoutines.fetchOne.fulfill());
  }
}

const getIfAnyResultProcessing = any(
  pipe(
    propOr([], 'jobs'),
    filter(either(propEq('jobState', JOB_STATE_PENDING), propEq('jobState', JOB_STATE_PROCESSING))),
    isEmpty,
    not
  )
);

function* fetchListLoop(payload) {
  try {
    while (true) {
      yield put(DataSourceRoutines.fetchList.request());

      const { data } = yield api.get(
        `${PROJECTS_PATH}/${payload.projectId}${DATA_SOURCES_PATH}?page_size=${PAGE_SIZE}`
      );

      yield put(DataSourceRoutines.fetchList.success(data.results));

      if (!getIfAnyResultProcessing(data.results)) {
        yield cancel();
      }

      yield delay(FETCH_LIST_DELAY);
    }
  } catch (error) {
    yield put(DataSourceRoutines.fetchList.failure(error));
  } finally {
    if (yield cancelled()) {
      yield put(DataSourceRoutines.fetchList.fulfill());
    }
  }
}

function* fetchList({ payload }) {
  const bgSyncTask = yield fork(fetchListLoop, payload);

  yield take(DataSourceRoutines.cancelFetchListLoop.TRIGGER);
  yield cancel(bgSyncTask);
}

function* updateOne({ payload: { dataSourceId, requestData, step } }) {
  try {
    yield put(DataSourceRoutines.updateOne.request());
    const formData = new FormData();

    yield api.patch(`${DATA_SOURCES_PATH}/${dataSourceId}`, { name: requestData.name });

    pipe(
      omit(['name']),
      keys,
      forEach(name => formData.append(name, requestData[name]))
    )(requestData);

    const { data } = yield api.patch(`${DATA_SOURCES_PATH}/${dataSourceId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const redirectUri = `/datasource/${dataSourceId}/${parseInt(step, 10) + 1}`;

    yield put(DataSourceRoutines.updateOne.success(data));

    browserHistory.push(redirectUri);
  } catch (error) {
    yield put(DataSourceRoutines.updateOne.failure(error));
  } finally {
    yield put(DataSourceRoutines.updateOne.fulfill());
  }
}

function* fetchFields({ payload }) {
  try {
    yield put(DataSourceRoutines.fetchOne.request());

    const { dataSourceId } = payload;
    const { data } = yield api.get(`${DATA_SOURCES_PATH}/${dataSourceId}${PREVIEW_PATH}`, { camelize: false });

    yield put(DataSourceRoutines.fetchFields.success(data));
  } catch (error) {
    yield put(DataSourceRoutines.fetchFields.failure(error));
  } finally {
    yield put(DataSourceRoutines.fetchFields.fulfill());
  }
}

export function* watchDataSource() {
  yield all([
    takeLatest(DataSourceRoutines.create.TRIGGER, create),
    takeLatest(DataSourceRoutines.removeOne.TRIGGER, removeOne),
    takeLatest(DataSourceRoutines.fetchOne.TRIGGER, fetchOne),
    takeLatest(DataSourceRoutines.updateOne.TRIGGER, updateOne),
    takeLatest(DataSourceRoutines.fetchList.TRIGGER, fetchList),
    takeLatest(DataSourceRoutines.fetchFields.TRIGGER, fetchFields),
  ]);
}
