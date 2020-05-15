import { all, put, takeLatest } from 'redux-saga/effects';
import reportError from '../../shared/utils/reportError';

import { DataSourceTagsRoutines } from './dataSourceTags.redux';
import api from '../../shared/services/api';
import { DATA_SOURCES_PATH, TAGS_PATH } from '../../shared/utils/api.constants';

function* fetchDataSourceTags({ payload }) {
  try {
    yield put(DataSourceTagsRoutines.fetchDataSourceTags.request());
    const { data } = yield api.get(`${DATA_SOURCES_PATH}/${payload.dataSourceId}${TAGS_PATH}`);

    yield put(DataSourceTagsRoutines.fetchDataSourceTags.success(data.results));
  } catch (error) {
    reportError(error);
    yield put(DataSourceTagsRoutines.fetchDataSourceTags.failure(error));
  } finally {
    yield put(DataSourceTagsRoutines.fetchDataSourceTags.fulfill());
  }
}

function* updateDataSourceTags({ payload: { dataSourceId, formData } }) {
  try {
    yield put(DataSourceTagsRoutines.updateDataSourceTags.request());
    const { data } = yield api.patch(`${DATA_SOURCES_PATH}/${dataSourceId}${TAGS_PATH}`, formData);

    yield put(DataSourceTagsRoutines.updateDataSourceTags.success(data.results));
  } catch (error) {
    reportError(error);
    yield put(DataSourceTagsRoutines.updateDataSourceTags.failure(error));
  } finally {
    yield put(DataSourceTagsRoutines.updateDataSourceTags.fulfill());
  }
}

export function* watchDataSourceTags() {
  yield all([
    takeLatest(DataSourceTagsRoutines.fetchDataSourceTags.TRIGGER, fetchDataSourceTags),
    takeLatest(DataSourceTagsRoutines.updateDataSourceTags.TRIGGER, updateDataSourceTags),
  ]);
}
