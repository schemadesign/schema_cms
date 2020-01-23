import { all, cancel, cancelled, delay, fork, put, select, take, takeLatest } from 'redux-saga/effects';
import { all as ramdaAll, any, both, either, includes, isEmpty, omit, pathOr, pipe, propEq, propIs, when } from 'ramda';

import { DataSourceRoutines } from './dataSource.redux';
import browserHistory from '../../shared/utils/history';
import api from '../../shared/services/api';
import { DATA_SOURCES_PATH, PREVIEW_PATH, PROJECTS_PATH } from '../../shared/utils/api.constants';
import {
  DATA_SOURCE_RUN_LAST_JOB,
  FETCH_LIST_DELAY,
  META_FAILED,
  META_SUCCESS,
  RESULT_PAGE,
} from './dataSource.constants';
import { formatFormData } from '../../shared/utils/helpers';
import { ProjectRoutines } from '../project';
import { selectUploadingDataSources } from './dataSource.selectors';

const PAGE_SIZE = 1000;

function* create({ payload }) {
  try {
    yield put(DataSourceRoutines.create.request());
    const requestData = { project: payload.projectId, ...omit(['file'], payload.requestData) };
    const formData = formatFormData({ file: payload.requestData.file });

    const { data } = yield api.post(DATA_SOURCES_PATH, requestData);

    yield put(DataSourceRoutines.create.success({ id: data.id, fileName: payload.requestData.file.name }));

    browserHistory.push(`/project/${payload.projectId}/datasource`);

    yield api.patch(`${DATA_SOURCES_PATH}/${data.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    yield put(DataSourceRoutines.removeUploadingDataSource(data.id));
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

    yield put(ProjectRoutines.setProject.trigger(data.project));
    yield put(DataSourceRoutines.fetchOne.success(data));
  } catch (error) {
    yield put(DataSourceRoutines.fetchOne.failure(error));
  } finally {
    yield put(DataSourceRoutines.fetchOne.fulfill());
  }
}

const getIfAllDataSourceProcessed = ({ data, uploadingDataSources }) =>
  either(
    isEmpty,
    ramdaAll(
      either(
        ({ id, fileName }) => !fileName && !any(propEq('id', id))(uploadingDataSources),
        both(
          both(propIs(Object, 'activeJob'), propEq('jobsInProcess', false)),
          pipe(
            pathOr('', ['metaData', 'status']),
            status => includes(status, [META_FAILED, META_SUCCESS])
          )
        )
      )
    )
  )(data);

function* fetchListLoop(payload) {
  try {
    while (true) {
      yield put(DataSourceRoutines.fetchList.request());

      const { data } = yield api.get(
        `${PROJECTS_PATH}/${payload.projectId}${DATA_SOURCES_PATH}?page_size=${PAGE_SIZE}`
      );

      yield put(ProjectRoutines.setProject.trigger(data.project));
      yield put(DataSourceRoutines.fetchList.success(data.results));
      const uploadingDataSources = yield select(selectUploadingDataSources);

      if (getIfAllDataSourceProcessed({ data: data.results, uploadingDataSources })) {
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
      const filteredData = pipe(
        omit(['name']),
        when(propEq(DATA_SOURCE_RUN_LAST_JOB, false), omit([DATA_SOURCE_RUN_LAST_JOB]))
      )(requestData);

      const formData = formatFormData(filteredData);

      const { data } = yield api.patch(`${DATA_SOURCES_PATH}/${dataSourceId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      response.data = data;

      browserHistory.push(`/project/${data.project.id}/datasource`);
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

    yield put(DataSourceRoutines.fetchPreview.success(data.results));
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

    yield put(ProjectRoutines.setProject.trigger(data.project));
    yield put(DataSourceRoutines.fetchFieldsInfo.success(data.results));
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
