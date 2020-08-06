import { all, put, takeLatest } from 'redux-saga/effects';

import { PageRoutines } from './page.redux';
import api from '../../shared/services/api';
import { PAGES_PATH, SECTIONS_PATH, PROJECTS_PATH } from '../../shared/utils/api.constants';
import browserHistory from '../../shared/utils/history';
import { ProjectRoutines } from '../project';
import reportError from '../../shared/utils/reportError';
import { SectionsRoutines } from '../sections';

function* fetchPage({ payload: { pageId } }) {
  try {
    yield put(PageRoutines.fetchPage.request());

    const {
      data: { project, results },
    } = yield api.get(`${PAGES_PATH}/${pageId}`);

    yield put(ProjectRoutines.setProject.trigger(project));
    yield put(PageRoutines.fetchPage.success({ ...results, projectId: project.id }));
  } catch (e) {
    reportError(e);
    yield put(PageRoutines.fetchPage.failure(e));
  } finally {
    yield put(PageRoutines.fetchPage.fulfill());
  }
}

function* createPage({ payload: { sectionId, formData } }) {
  try {
    yield put(PageRoutines.createPage.request());

    const { data } = yield api.post(`${SECTIONS_PATH}/${sectionId}${PAGES_PATH}`, formData);

    yield put(PageRoutines.createPage.success(data));
  } catch (e) {
    reportError(e);
    yield put(PageRoutines.createPage.failure(e));
  } finally {
    yield put(PageRoutines.createPage.fulfill());
  }
}

function* updatePage({ payload: { pageId, formData } }) {
  try {
    yield put(PageRoutines.updatePage.request());

    const { data } = yield api.patch(`${PAGES_PATH}/${pageId}`, formData);

    yield put(PageRoutines.updatePage.success(data));
  } catch (e) {
    reportError(e);
    yield put(PageRoutines.updatePage.failure(e));
  } finally {
    yield put(PageRoutines.updatePage.fulfill());
  }
}

function* publishPage({ payload: { pageId, formData } }) {
  try {
    yield put(PageRoutines.publishPage.request());
    const { data } = yield api.get(`${PAGES_PATH}/${pageId}/publish`, formData);

    yield put(PageRoutines.publishPage.success(data));
  } catch (e) {
    reportError(e);
    yield put(PageRoutines.publishPage.failure(e));
  } finally {
    yield put(PageRoutines.publishPage.fulfill());
  }
}

function* removePage({ payload: { pageId, folderId } }) {
  try {
    yield put(PageRoutines.removePage.request());

    yield api.delete(`${PAGES_PATH}/${pageId}`);

    yield put(PageRoutines.removePage.success());
    browserHistory.push(`/folder/${folderId}`);
  } catch (e) {
    reportError(e);
    yield put(PageRoutines.removePage.failure(e));
  } finally {
    yield put(PageRoutines.removePage.fulfill());
  }
}

function* copyPage({ payload: { pageId, sectionId } }) {
  try {
    yield put(PageRoutines.copyPage.request());

    yield api.post(`${PAGES_PATH}/${pageId}/copy`);

    if (sectionId) {
      yield put(SectionsRoutines.fetchPages.trigger({ sectionId }));
    }

    yield put(PageRoutines.copyPage.success());
  } catch (e) {
    reportError(e);
    yield put(PageRoutines.copyPage.failure(e));
  } finally {
    yield put(PageRoutines.copyPage.fulfill());
  }
}

function* fetchPageAdditionalData({ payload: { projectId } }) {
  try {
    yield put(PageRoutines.fetchPageAdditionalData.request());

    const { data } = yield api.get(`${PROJECTS_PATH}/${projectId}/page-additional-data`);

    yield put(PageRoutines.fetchPageAdditionalData.success(data));
  } catch (e) {
    reportError(e);
    yield put(PageRoutines.fetchPageAdditionalData.failure(e));
  } finally {
    yield put(PageRoutines.fetchPageAdditionalData.fulfill());
  }
}

export function* watchPage() {
  yield all([
    takeLatest(PageRoutines.fetchPage.TRIGGER, fetchPage),
    takeLatest(PageRoutines.createPage.TRIGGER, createPage),
    takeLatest(PageRoutines.updatePage.TRIGGER, updatePage),
    takeLatest(PageRoutines.removePage.TRIGGER, removePage),
    takeLatest(PageRoutines.publishPage.TRIGGER, publishPage),
    takeLatest(PageRoutines.copyPage.TRIGGER, copyPage),
    takeLatest(PageRoutines.fetchPageAdditionalData.TRIGGER, fetchPageAdditionalData),
  ]);
}
