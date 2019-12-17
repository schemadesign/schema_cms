import { all, cancel, cancelled, delay, fork, put, take, takeLatest } from 'redux-saga/effects';
import { all as ramdaAll, both, either, forEach, isEmpty, keys, omit, pipe, propEq, propIs, map, when } from 'ramda';
import { camelize, decamelize } from 'humps';

import { DataSourceRoutines } from './dataSource.redux';
import browserHistory from '../../shared/utils/history';
import api from '../../shared/services/api';
import { DATA_SOURCES_PATH, PREVIEW_PATH, PROJECTS_PATH } from '../../shared/utils/api.constants';
import { DATA_SOURCE_RUN_LAST_JOB, FETCH_LIST_DELAY, RESULT_PAGE } from './dataSource.constants';

const PAGE_SIZE = 1000;

function* create({ payload }) {
  try {
    yield put(DataSourceRoutines.create.request());
    const formData = new FormData();
    const requestData = { project: payload.projectId, ...payload.requestData };

    pipe(
      keys,
      forEach(name => formData.append(name, requestData[name]))
    )(requestData);

    const { data } = yield api.post(DATA_SOURCES_PATH, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    browserHistory.push(`/project/${payload.projectId}/datasource`);
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

const getIfAllDataSourceProcessed = either(
  isEmpty,
  ramdaAll(both(propIs(Object, 'activeJob'), propEq('jobsInProcess', false)))
);

function* fetchListLoop(payload) {
  try {
    while (true) {
      yield put(DataSourceRoutines.fetchList.request());

      const { data } = yield api.get(
        `${PROJECTS_PATH}/${payload.projectId}${DATA_SOURCES_PATH}?page_size=${PAGE_SIZE}`
      );

      yield put(DataSourceRoutines.fetchList.success(data.results));

      if (getIfAllDataSourceProcessed(data.results)) {
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

function* updateOne({ payload: { dataSourceId, requestData } }) {
  try {
    yield put(DataSourceRoutines.updateOne.request());
    const response = yield api.patch(`${DATA_SOURCES_PATH}/${dataSourceId}`, { name: requestData.name });

    if (requestData.file) {
      const formData = new FormData();

      pipe(
        omit(['name']),
        when(propEq(DATA_SOURCE_RUN_LAST_JOB, false), omit([DATA_SOURCE_RUN_LAST_JOB])),
        keys,
        map(decamelize),
        forEach(name => formData.append(name, requestData[camelize(name)]))
      )(requestData);

      const { data } = yield api.patch(`${DATA_SOURCES_PATH}/${dataSourceId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      response.data = data;

      browserHistory.push(`/project/${data.project}/datasource`);
    }

    yield put(DataSourceRoutines.updateOne.success(response.data));
  } catch (error) {
    yield put(DataSourceRoutines.updateOne.failure(error));
  } finally {
    yield put(DataSourceRoutines.updateOne.fulfill());
  }
}

function* fetchPreview({ payload }) {
  try {
    yield put(DataSourceRoutines.fetchPreview.request());

    const { dataSourceId } = payload;
    const { data } = yield api.get(`${DATA_SOURCES_PATH}/${dataSourceId}${PREVIEW_PATH}`, { camelize: false });

    yield put(DataSourceRoutines.fetchPreview.success(data));
  } catch (error) {
    yield put(DataSourceRoutines.fetchPreview.failure(error));
  } finally {
    yield put(DataSourceRoutines.fetchPreview.fulfill());
  }
}

function* fetchFieldsInfo({ payload }) {
  try {
    yield put(DataSourceRoutines.fetchFieldsInfo.request());

    const { dataSourceId } = payload;
    const { data } = yield api.get(`${DATA_SOURCES_PATH}/${dataSourceId}/fields-info`);

    yield put(DataSourceRoutines.fetchFieldsInfo.success(data));
  } catch (error) {
    yield put(DataSourceRoutines.fetchFieldsInfo.failure(error));
  } finally {
    yield put(DataSourceRoutines.fetchFieldsInfo.fulfill());
  }
}

function* revertToJob({ payload: { dataSourceId, jobId } }) {
  try {
    yield put(DataSourceRoutines.revertToJob.request());

    const { data } = yield api.post(`${DATA_SOURCES_PATH}/${dataSourceId}/revert-job`, { id: jobId });

    yield put(DataSourceRoutines.revertToJob.success(data));
    browserHistory.push(`/datasource/${dataSourceId}/${RESULT_PAGE}`);
  } catch (error) {
    yield put(DataSourceRoutines.revertToJob.failure(error));
  } finally {
    yield put(DataSourceRoutines.revertToJob.fulfill());
  }
}

export function* watchDataSource() {
  yield all([
    takeLatest(DataSourceRoutines.create.TRIGGER, create),
    takeLatest(DataSourceRoutines.removeOne.TRIGGER, removeOne),
    takeLatest(DataSourceRoutines.fetchOne.TRIGGER, fetchOne),
    takeLatest(DataSourceRoutines.updateOne.TRIGGER, updateOne),
    takeLatest(DataSourceRoutines.fetchList.TRIGGER, fetchList),
    takeLatest(DataSourceRoutines.fetchFieldsInfo.TRIGGER, fetchFieldsInfo),
    takeLatest(DataSourceRoutines.revertToJob.TRIGGER, revertToJob),
    takeLatest(DataSourceRoutines.fetchPreview.TRIGGER, fetchPreview),
  ]);
}
