import { all, put, takeLatest } from 'redux-saga/effects';

import { ProjectTagRoutines } from './projectTag.redux';
import api from '../../shared/services/api';
import { PROJECTS_PATH, TAG_CATEGORIES_PATH } from '../../shared/utils/api.constants';
import browserHistory from '../../shared/utils/history';
import { TAGS_PAGE } from '../project/project.constants';
import { ROUTES } from '../../routes';
import { ProjectRoutines } from '../project';

function* fetchList({ payload: { projectId } }) {
  try {
    yield put(ProjectTagRoutines.fetchList.request());

    const { data } = yield api.get(`${PROJECTS_PATH}/${projectId}${TAG_CATEGORIES_PATH}`);

    yield put(ProjectTagRoutines.fetchList.success(data.results));
  } catch (e) {
    yield put(ProjectTagRoutines.fetchList.failure(e));
  } finally {
    yield put(ProjectTagRoutines.fetchList.fulfill());
  }
}

function* setTags({ payload: { projectId, active, inactive } }) {
  try {
    yield put(ProjectTagRoutines.setTags.request());

    const { data } = yield api.post(`${PROJECTS_PATH}/${projectId}/set-tags-lists`, { active, inactive });

    yield put(ProjectTagRoutines.setTags.success(data));
  } catch (e) {
    yield put(ProjectTagRoutines.setTags.failure(e));
  } finally {
    yield put(ProjectTagRoutines.setTags.fulfill());
  }
}

function* createTag({ payload: { projectId, formData } }) {
  try {
    yield put(ProjectTagRoutines.createTag.request());

    const { data } = yield api.post(`${PROJECTS_PATH}/${projectId}${TAG_CATEGORIES_PATH}`, formData);

    browserHistory.push(`${ROUTES.PROJECT}/${projectId}/${TAGS_PAGE}`);

    yield put(ProjectTagRoutines.createTag.success(data));
  } catch (e) {
    yield put(ProjectTagRoutines.createTag.failure(e));
  } finally {
    yield put(ProjectTagRoutines.createTag.fulfill());
  }
}

function* fetchTag({ payload: { tagId } }) {
  try {
    yield put(ProjectTagRoutines.fetchTag.request());

    const { data } = yield api.get(`${TAG_CATEGORIES_PATH}/${tagId}`);

    yield put(ProjectRoutines.setProject(data.project));
    yield put(ProjectTagRoutines.fetchTag.success(data.results));
  } catch (e) {
    yield put(ProjectTagRoutines.fetchTag.failure(e));
  } finally {
    yield put(ProjectTagRoutines.fetchTag.fulfill());
  }
}

function* updateTag({ payload: { tagId, projectId, formData } }) {
  try {
    yield put(ProjectTagRoutines.updateTag.request());

    const { data } = yield api.patch(`${TAG_CATEGORIES_PATH}/${tagId}`, { ...formData });
    browserHistory.push(`${ROUTES.PROJECT}/${projectId}/${TAGS_PAGE}`);

    yield put(ProjectTagRoutines.updateTag.success(data));
  } catch (e) {
    yield put(ProjectTagRoutines.updateTag.failure(e));
  } finally {
    yield put(ProjectTagRoutines.updateTag.fulfill());
  }
}

function* removeTag({ payload: { tagId, projectId } }) {
  try {
    yield put(ProjectTagRoutines.removeTag.request());

    const { data } = yield api.delete(`${TAG_CATEGORIES_PATH}/${tagId}`);
    browserHistory.push(`${ROUTES.PROJECT}/${projectId}/${TAGS_PAGE}`);

    yield put(ProjectTagRoutines.removeTag.success(data));
  } catch (e) {
    yield put(ProjectTagRoutines.removeTag.failure(e));
  } finally {
    yield put(ProjectTagRoutines.removeTag.fulfill());
  }
}

export function* watchProjectTag() {
  yield all([
    takeLatest(ProjectTagRoutines.fetchList.TRIGGER, fetchList),
    takeLatest(ProjectTagRoutines.setTags.TRIGGER, setTags),
    takeLatest(ProjectTagRoutines.createTag.TRIGGER, createTag),
    takeLatest(ProjectTagRoutines.fetchTag.TRIGGER, fetchTag),
    takeLatest(ProjectTagRoutines.removeTag.TRIGGER, removeTag),
    takeLatest(ProjectTagRoutines.updateTag.TRIGGER, updateTag),
  ]);
}
