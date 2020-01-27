import { all, put, takeLatest } from 'redux-saga/effects';

import { DataSourceTagRoutines } from './dataSourceTag.redux';
import api from '../../shared/services/api';
import { DATA_SOURCES_PATH, TAGS_PATH } from '../../shared/utils/api.constants';
import browserHistory from '../../shared/utils/history';
import { TAGS_PAGE } from '../dataSource/dataSource.constants';
import { ROUTES } from '../../routes';

function* fetchList({ payload: { dataSourceId } }) {
  try {
    yield put(DataSourceTagRoutines.fetchList.request());

    const { data } = yield api.get(`${DATA_SOURCES_PATH}/${dataSourceId}/tags`);

    yield put(DataSourceTagRoutines.fetchList.success(data.results));
  } catch (e) {
    yield put(DataSourceTagRoutines.fetchList.failure(e));
  } finally {
    yield put(DataSourceTagRoutines.fetchList.fulfill());
  }
}

function* setTags({ payload: { dataSourceId, active, inactive } }) {
  try {
    yield put(DataSourceTagRoutines.setTags.request());

    const { data } = yield api.post(`${DATA_SOURCES_PATH}/${dataSourceId}/set-tags`, { active, inactive });

    yield put(DataSourceTagRoutines.setTags.success(data));
  } catch (e) {
    yield put(DataSourceTagRoutines.setTags.failure(e));
  } finally {
    yield put(DataSourceTagRoutines.setTags.fulfill());
  }
}

function* createTag({ payload: { dataSourceId, formData } }) {
  try {
    yield put(DataSourceTagRoutines.createTag.request());

    const { data } = yield api.post(`${DATA_SOURCES_PATH}/${dataSourceId}/tags`, { ...formData, isActive: true });

    browserHistory.push(`${ROUTES.DATA_SOURCE}/${dataSourceId}/${TAGS_PAGE}`);

    yield put(DataSourceTagRoutines.createTag.success(data));
  } catch (e) {
    yield put(DataSourceTagRoutines.createTag.failure(e));
  } finally {
    yield put(DataSourceTagRoutines.createTag.fulfill());
  }
}

function* fetchTag({ payload: { tagId } }) {
  try {
    yield put(DataSourceTagRoutines.fetchTag.request());

    const { data } = yield api.get(`${TAGS_PATH}/${tagId}`);

    yield put(DataSourceTagRoutines.fetchTag.success(data));
  } catch (e) {
    yield put(DataSourceTagRoutines.fetchTag.failure(e));
  } finally {
    yield put(DataSourceTagRoutines.fetchTag.fulfill());
  }
}

function* updateTag({ payload: { tagId, dataSourceId, formData } }) {
  try {
    yield put(DataSourceTagRoutines.updateTag.request());

    const { data } = yield api.put(`${TAGS_PATH}/${tagId}`, { ...formData });
    browserHistory.push(`${ROUTES.DATA_SOURCE}/${dataSourceId}/${TAGS_PAGE}`);

    yield put(DataSourceTagRoutines.updateTag.success(data));
  } catch (e) {
    yield put(DataSourceTagRoutines.updateTag.failure(e));
  } finally {
    yield put(DataSourceTagRoutines.updateTag.fulfill());
  }
}

function* removeTag({ payload: { tagId, dataSourceId } }) {
  try {
    yield put(DataSourceTagRoutines.removeTag.request());

    const { data } = yield api.delete(`${TAGS_PATH}/${tagId}`);
    browserHistory.push(`${ROUTES.DATA_SOURCE}/${dataSourceId}/${TAGS_PAGE}`);

    yield put(DataSourceTagRoutines.removeTag.success(data));
  } catch (e) {
    yield put(DataSourceTagRoutines.removeTag.failure(e));
  } finally {
    yield put(DataSourceTagRoutines.removeTag.fulfill());
  }
}

export function* watchDataSourceTag() {
  yield all([
    takeLatest(DataSourceTagRoutines.fetchList.TRIGGER, fetchList),
    takeLatest(DataSourceTagRoutines.setTags.TRIGGER, setTags),
    takeLatest(DataSourceTagRoutines.createTag.TRIGGER, createTag),
    takeLatest(DataSourceTagRoutines.fetchTag.TRIGGER, fetchTag),
    takeLatest(DataSourceTagRoutines.removeTag.TRIGGER, removeTag),
    takeLatest(DataSourceTagRoutines.updateTag.TRIGGER, updateTag),
  ]);
}
