import { all, put, takeLatest } from 'redux-saga/effects';
import { stringifyUrl } from 'query-string';

import { TagCategoryRoutines } from './tagCategory.redux';
import api from '../../shared/services/api';
import { PROJECTS_PATH, TAG_CATEGORIES_PATH } from '../../shared/utils/api.constants';
import browserHistory from '../../shared/utils/history';
import { TAG_CATEGORIES_PAGE } from '../project/project.constants';
import { ROUTES } from '../../routes';
import { ProjectRoutines } from '../project';

function* fetchTagCategories({ payload: { projectId, ...query } }) {
  try {
    yield put(TagCategoryRoutines.fetchTagCategories.request());

    const url = stringifyUrl({ url: `${PROJECTS_PATH}/${projectId}${TAG_CATEGORIES_PATH}`, query });
    const { data } = yield api.get(url);

    yield put(TagCategoryRoutines.fetchTagCategories.success(data.results));
  } catch (e) {
    yield put(TagCategoryRoutines.fetchTagCategories.failure(e));
  } finally {
    yield put(TagCategoryRoutines.fetchTagCategories.fulfill());
  }
}

function* createTagCategory({ payload: { projectId, formData } }) {
  try {
    yield put(TagCategoryRoutines.createTagCategory.request());

    const { data } = yield api.post(`${PROJECTS_PATH}/${projectId}${TAG_CATEGORIES_PATH}`, formData);

    browserHistory.push(`${ROUTES.PROJECT}/${projectId}/${TAG_CATEGORIES_PAGE}`);

    yield put(TagCategoryRoutines.createTagCategory.success(data));
  } catch (e) {
    yield put(TagCategoryRoutines.createTagCategory.failure(e));
  } finally {
    yield put(TagCategoryRoutines.createTagCategory.fulfill());
  }
}

function* fetchTagCategory({ payload: { tagCategoryId } }) {
  try {
    yield put(TagCategoryRoutines.fetchTagCategory.request());

    const { data } = yield api.get(`${TAG_CATEGORIES_PATH}/${tagCategoryId}`);

    yield put(ProjectRoutines.setProject(data.project));
    yield put(TagCategoryRoutines.fetchTagCategory.success(data.results));
  } catch (e) {
    yield put(TagCategoryRoutines.fetchTagCategory.failure(e));
  } finally {
    yield put(TagCategoryRoutines.fetchTagCategory.fulfill());
  }
}

function* updateTagCategory({ payload: { tagCategoryId, projectId, formData } }) {
  try {
    yield put(TagCategoryRoutines.updateTagCategory.request());

    const { data } = yield api.patch(`${TAG_CATEGORIES_PATH}/${tagCategoryId}`, { ...formData });
    browserHistory.push(`${ROUTES.PROJECT}/${projectId}/${TAG_CATEGORIES_PAGE}`);

    yield put(TagCategoryRoutines.updateTagCategory.success(data));
  } catch (e) {
    yield put(TagCategoryRoutines.updateTagCategory.failure(e));
  } finally {
    yield put(TagCategoryRoutines.updateTagCategory.fulfill());
  }
}

function* removeTagCategory({ payload: { tagCategoryId, projectId } }) {
  try {
    yield put(TagCategoryRoutines.removeTagCategory.request());

    const { data } = yield api.delete(`${TAG_CATEGORIES_PATH}/${tagCategoryId}`);
    browserHistory.push(`${ROUTES.PROJECT}/${projectId}/${TAG_CATEGORIES_PAGE}`);

    yield put(TagCategoryRoutines.removeTagCategory.success(data));
  } catch (e) {
    yield put(TagCategoryRoutines.removeTagCategory.failure(e));
  } finally {
    yield put(TagCategoryRoutines.removeTagCategory.fulfill());
  }
}

export function* watchTagCategory() {
  yield all([
    takeLatest(TagCategoryRoutines.fetchTagCategories.TRIGGER, fetchTagCategories),
    takeLatest(TagCategoryRoutines.createTagCategory.TRIGGER, createTagCategory),
    takeLatest(TagCategoryRoutines.fetchTagCategory.TRIGGER, fetchTagCategory),
    takeLatest(TagCategoryRoutines.removeTagCategory.TRIGGER, removeTagCategory),
    takeLatest(TagCategoryRoutines.updateTagCategory.TRIGGER, updateTagCategory),
  ]);
}
