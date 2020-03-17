import { all, put, takeLatest } from 'redux-saga/effects';

import { PageRoutines } from './page.redux';
import api from '../../shared/services/api';
import { PAGES_PATH, SECTIONS_PATH } from '../../shared/utils/api.constants';
import browserHistory from '../../shared/utils/history';
import { ProjectRoutines } from '../project';
import reportError from '../../shared/utils/reportError';

function* fetchPage({ payload: { pageId } }) {
  try {
    yield put(PageRoutines.fetchPage.request());

    const { data } = yield api.get(`${PAGES_PATH}/${pageId}`);

    yield put(ProjectRoutines.setProject.trigger(data.project));
    yield put(PageRoutines.fetchPage.success(data));
  } catch (e) {
    reportError(e);
    yield put(PageRoutines.fetchPage.failure(e));
  } finally {
    yield put(PageRoutines.fetchPage.fulfill());
  }
}

function* createPage({ payload: { folderId, ...payload } }) {
  try {
    yield put(PageRoutines.createPage.request());

    const { data } = yield api.post(`${SECTIONS_PATH}/${folderId}${PAGES_PATH}`, { ...payload });

    yield put(PageRoutines.createPage.success(data));
    browserHistory.push(`/folder/${folderId}`);
  } catch (e) {
    reportError(e);
    yield put(PageRoutines.createPage.failure(e));
  } finally {
    yield put(PageRoutines.createPage.fulfill());
  }
}

function* updatePage({ payload: { pageId, folderId, ...payload } }) {
  try {
    yield put(PageRoutines.updatePage.request());

    const { data } = yield api.patch(`${PAGES_PATH}/${pageId}`, { ...payload });

    yield put(PageRoutines.updatePage.success(data));
    browserHistory.push(`/folder/${folderId}`);
  } catch (e) {
    reportError(e);
    yield put(PageRoutines.updatePage.failure(e));
  } finally {
    yield put(PageRoutines.updatePage.fulfill());
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

export function* watchPage() {
  yield all([
    takeLatest(PageRoutines.fetchPage.TRIGGER, fetchPage),
    takeLatest(PageRoutines.createPage.TRIGGER, createPage),
    takeLatest(PageRoutines.updatePage.TRIGGER, updatePage),
    takeLatest(PageRoutines.removePage.TRIGGER, removePage),
  ]);
}
