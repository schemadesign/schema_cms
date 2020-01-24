import { all, put, takeLatest } from 'redux-saga/effects';

import { TagRoutines } from './tag.redux';
import api from '../../shared/services/api';
import { DATA_SOURCES_PATH, TAGS_PATH } from '../../shared/utils/api.constants';
import browserHistory from '../../shared/utils/history';
import { TAGS_PAGE } from '../dataSource/dataSource.constants';
import { ROUTES } from '../../routes';

function* fetchList({ payload: { dataSourceId } }) {
  try {
    yield put(TagRoutines.fetchList.request());

    const { data } = yield api.get(`${DATA_SOURCES_PATH}/${dataSourceId}/tags`);

    yield put(TagRoutines.fetchList.success(data.results));
  } catch (e) {
    yield put(TagRoutines.fetchList.failure(e));
  } finally {
    yield put(TagRoutines.fetchList.fulfill());
  }
}

function* setTags({ payload: { dataSourceId, active, inactive } }) {
  try {
    yield put(TagRoutines.setTags.request());

    const { data } = yield api.post(`${DATA_SOURCES_PATH}/${dataSourceId}/set-tags`, { active, inactive });

    yield put(TagRoutines.setTags.success(data));
  } catch (e) {
    yield put(TagRoutines.setTags.failure(e));
  } finally {
    yield put(TagRoutines.setTags.fulfill());
  }
}

function* createTag({ payload: { dataSourceId, formData } }) {
  try {
    yield put(TagRoutines.createTag.request());

    const { data } = yield api.post(`${DATA_SOURCES_PATH}/${dataSourceId}/tags`, { ...formData, isActive: true });

    browserHistory.push(`${ROUTES.DATA_SOURCE}/${dataSourceId}/${TAGS_PAGE}`);

    yield put(TagRoutines.createTag.success(data));
  } catch (e) {
    yield put(TagRoutines.createTag.failure(e));
  } finally {
    yield put(TagRoutines.createTag.fulfill());
  }
}

function* fetchTag({ payload: { tagId } }) {
  try {
    yield put(TagRoutines.fetchTag.request());

    const { data } = yield api.get(`${TAGS_PATH}/${tagId}`);

    yield put(TagRoutines.fetchTag.success(data));
  } catch (e) {
    yield put(TagRoutines.fetchTag.failure(e));
  } finally {
    yield put(TagRoutines.fetchTag.fulfill());
  }
}

function* updateTag({ payload: { tagId, dataSourceId, formData } }) {
  try {
    yield put(TagRoutines.updateTag.request());

    const { data } = yield api.put(`${TAGS_PATH}/${tagId}`, { ...formData });
    browserHistory.push(`${ROUTES.DATA_SOURCE}/${dataSourceId}/${TAGS_PAGE}`);

    yield put(TagRoutines.updateTag.success(data));
  } catch (e) {
    yield put(TagRoutines.updateTag.failure(e));
  } finally {
    yield put(TagRoutines.updateTag.fulfill());
  }
}

function* removeTag({ payload: { tagId, dataSourceId } }) {
  try {
    yield put(TagRoutines.removeTag.request());

    const { data } = yield api.delete(`${TAGS_PATH}/${tagId}`);
    browserHistory.push(`${ROUTES.DATA_SOURCE}/${dataSourceId}/${TAGS_PAGE}`);

    yield put(TagRoutines.removeTag.success(data));
  } catch (e) {
    yield put(TagRoutines.removeTag.failure(e));
  } finally {
    yield put(TagRoutines.removeTag.fulfill());
  }
}

export function* watchTag() {
  yield all([
    takeLatest(TagRoutines.fetchList.TRIGGER, fetchList),
    takeLatest(TagRoutines.setTags.TRIGGER, setTags),
    takeLatest(TagRoutines.createTag.TRIGGER, createTag),
    takeLatest(TagRoutines.fetchTag.TRIGGER, fetchTag),
    takeLatest(TagRoutines.removeTag.TRIGGER, removeTag),
    takeLatest(TagRoutines.updateTag.TRIGGER, updateTag),
  ]);
}
