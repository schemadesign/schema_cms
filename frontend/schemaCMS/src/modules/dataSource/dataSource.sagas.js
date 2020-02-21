import {
  all,
  call,
  cancel,
  cancelled,
  delay,
  fork,
  put,
  select,
  take,
  takeLatest,
  takeEvery,
} from 'redux-saga/effects';
import {
  all as ramdaAll,
  any,
  both,
  either,
  includes,
  isEmpty,
  omit,
  pathOr,
  pipe,
  propEq,
  path,
  when,
  is,
} from 'ramda';
import { eventChannel } from 'redux-saga';

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
import { JOB_STATE_FAILURE, JOB_STATE_SUCCESS } from '../job/job.constants';
import reportError from '../../shared/utils/reportError';

const PAGE_SIZE = 1000;

function createUploaderChannel({ formData, id }) {
  return eventChannel(emit => {
    const onProgress = ({ total, loaded }) => {
      const progress = Math.round((loaded * 100) / (total || 1));

      emit({ progress });
    };

    api
      .patch(`${DATA_SOURCES_PATH}/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: onProgress,
      })
      .then(({ data }) => {
        emit({ data });
      })
      .catch(error => {
        emit({ error, data: { id } });
      });

    return () => {};
  });
}

function* uploadProgressWatcher(channel, id) {
  while (true) {
    try {
      yield put(DataSourceRoutines.updateProgress.request());
      const { progress, data, error } = yield take(channel);

      if (is(Number, progress)) {
        yield put(DataSourceRoutines.updateProgress.success({ progress, id }));
      }

      if (data || error) {
        yield put(DataSourceRoutines.removeUploadingDataSource(data));
      }
    } catch (error) {
      reportError(error);
      yield put(DataSourceRoutines.updateProgress.failure(error));
    } finally {
      if (yield cancelled()) {
        channel.close();
      }
    }
  }
}

function* create({ payload }) {
  try {
    yield put(DataSourceRoutines.create.request());
    const requestData = { project: payload.projectId, ...omit(['file'], payload.requestData) };
    const formData = formatFormData({ file: payload.requestData.file });

    const {
      data: { id },
    } = yield api.post(DATA_SOURCES_PATH, requestData);

    yield put(
      DataSourceRoutines.create.success({
        dataSource: { id, fileName: payload.requestData.file.name, progress: 0 },
        isUpload: true,
      })
    );
    browserHistory.push(`/project/${payload.projectId}/datasource`);

    const uploadChannel = yield call(createUploaderChannel, { formData, id });
    yield fork(uploadProgressWatcher, uploadChannel, id);
  } catch (error) {
    reportError(error);
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
      both(
        ({ id }) => !any(propEq('id', id))(uploadingDataSources),
        either(
          both(
            pipe(
              pathOr('', ['metaData', 'status']),
              status => includes(status, [META_FAILED, META_SUCCESS])
            ),
            pipe(
              path(['jobsState', 'lastJobStatus']),
              status => includes(status, [JOB_STATE_FAILURE, JOB_STATE_SUCCESS, null])
            )
          ),
          propEq('fileName', null)
        )
      )
    )
  )(data);

function* fetchListLoop({ projectId, rawList = false }) {
  try {
    while (true) {
      yield put(DataSourceRoutines.fetchList.request());
      const rawListQuery = rawList ? `&raw_list=${rawList}` : '';
      const { data } = yield api.get(
        `${PROJECTS_PATH}/${projectId}${DATA_SOURCES_PATH}?page_size=${PAGE_SIZE}${rawListQuery}`
      );

      yield put(ProjectRoutines.setProject.trigger(data.project));
      yield put(DataSourceRoutines.fetchList.success(data.results));
      const uploadingDataSources = yield select(selectUploadingDataSources);
      const isDataSourceProcessed = getIfAllDataSourceProcessed({ data: data.results, uploadingDataSources });

      if (isDataSourceProcessed || rawList) {
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

function* updateOne({ payload: { requestData, dataSource } }) {
  try {
    yield put(DataSourceRoutines.updateOne.request());
    const response = {
      data: dataSource,
    };

    if (requestData.name) {
      const { data } = yield api.patch(`${DATA_SOURCES_PATH}/${dataSource.id}`, { name: requestData.name });
      response.data = data;
    }

    if (requestData.file) {
      const filteredData = pipe(
        omit(['name']),
        when(propEq(DATA_SOURCE_RUN_LAST_JOB, false), omit([DATA_SOURCE_RUN_LAST_JOB]))
      )(requestData);
      const formData = formatFormData(filteredData);

      yield put(
        DataSourceRoutines.updateOne.success({
          dataSource: { ...dataSource, fileName: requestData.file.name, progress: 0 },
          isUpload: true,
        })
      );
      browserHistory.push(`/project/${dataSource.project.id}/datasource`);
      const uploadChannel = yield call(createUploaderChannel, { formData, id: dataSource.id });
      yield fork(uploadProgressWatcher, uploadChannel, dataSource.id);
      return;
    }

    yield put(DataSourceRoutines.updateOne.success({ dataSource: response.data }));
  } catch (error) {
    reportError(error);
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

function* fetchFieldsInfo({ payload: { dataSourceId, field } }) {
  try {
    yield put(DataSourceRoutines.fetchFieldsInfo.request());

    const fieldQuery = field ? `?field_name=${field}&states_view=true` : '';
    const { data } = yield api.get(`${DATA_SOURCES_PATH}/${dataSourceId}/fields-info${fieldQuery}`);

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
    takeEvery(DataSourceRoutines.create.TRIGGER, create),
    takeLatest(DataSourceRoutines.removeOne.TRIGGER, removeOne),
    takeLatest(DataSourceRoutines.fetchOne.TRIGGER, fetchOne),
    takeLatest(DataSourceRoutines.updateOne.TRIGGER, updateOne),
    takeLatest(DataSourceRoutines.fetchList.TRIGGER, fetchList),
    takeLatest(DataSourceRoutines.fetchFieldsInfo.TRIGGER, fetchFieldsInfo),
    takeLatest(DataSourceRoutines.revertToJob.TRIGGER, revertToJob),
    takeLatest(DataSourceRoutines.fetchPreview.TRIGGER, fetchPreview),
  ]);
}
