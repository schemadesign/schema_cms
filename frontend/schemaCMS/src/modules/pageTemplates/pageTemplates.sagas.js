import { all, put, takeLatest } from 'redux-saga/effects';
import reportError from '../../shared/utils/reportError';

import { PageTemplatesRoutines } from './pageTemplates.redux';
import api from '../../shared/services/api';
import { PAGE_TEMPLATES_PATH, PROJECTS_PATH } from '../../shared/utils/api.constants';
import { ProjectRoutines } from '../project';

function* fetchPageTemplates({ payload: { projectId } }) {
  try {
    yield put(PageTemplatesRoutines.fetchPageTemplates.request());

    const { data } = yield api.get(`${PROJECTS_PATH}/${projectId}${PAGE_TEMPLATES_PATH}`);

    yield put(PageTemplatesRoutines.fetchPageTemplates.success(data.results));
  } catch (error) {
    reportError(error);
    yield put(PageTemplatesRoutines.fetchPageTemplates.failure(error));
  } finally {
    yield put(PageTemplatesRoutines.fetchPageTemplates.fulfill());
  }
}

function* fetchPageTemplate({ payload: { pageTemplateId } }) {
  try {
    yield put(PageTemplatesRoutines.fetchPageTemplate.request());

    const { data } = yield api.get(`${PAGE_TEMPLATES_PATH}/${pageTemplateId}`);

    yield put(ProjectRoutines.setProject.trigger(data.project));
    yield put(PageTemplatesRoutines.fetchPageTemplate.success(data.results));
  } catch (error) {
    reportError(error);
    yield put(PageTemplatesRoutines.fetchPageTemplate.failure(error));
  } finally {
    yield put(PageTemplatesRoutines.fetchPageTemplate.fulfill());
  }
}

function* createPageTemplate({ payload: { projectId, formData } }) {
  try {
    yield put(PageTemplatesRoutines.createPageTemplate.request());

    const { data } = yield api.post(`${PROJECTS_PATH}/${projectId}${PAGE_TEMPLATES_PATH}`, formData);

    yield put(PageTemplatesRoutines.createPageTemplate.success(data.results));
  } catch (error) {
    reportError(error);
    yield put(PageTemplatesRoutines.createPageTemplate.failure(error));
  } finally {
    yield put(PageTemplatesRoutines.createPageTemplate.fulfill());
  }
}

function* updatePageTemplate({ payload: { pageTemplateId, formData } }) {
  try {
    yield put(PageTemplatesRoutines.updatePageTemplate.request());

    const { data } = yield api.patch(`${PAGE_TEMPLATES_PATH}/${pageTemplateId}`, formData);

    yield put(PageTemplatesRoutines.updatePageTemplate.success(data));
  } catch (error) {
    reportError(error);
    yield put(PageTemplatesRoutines.updatePageTemplate.failure(error));
  } finally {
    yield put(PageTemplatesRoutines.updatePageTemplate.fulfill());
  }
}

function* removePageTemplate({ payload: { pageTemplateId } }) {
  try {
    yield put(PageTemplatesRoutines.removePageTemplate.request());

    const { data } = yield api.delete(`${PAGE_TEMPLATES_PATH}/${pageTemplateId}`);

    yield put(PageTemplatesRoutines.removePageTemplate.success(data.results));
  } catch (error) {
    reportError(error);
    yield put(PageTemplatesRoutines.removePageTemplate.failure(error));
  } finally {
    yield put(PageTemplatesRoutines.removePageTemplate.fulfill());
  }
}

function* copyPageTemplate({ payload: { pageTemplateId, projectId } }) {
  try {
    yield put(PageTemplatesRoutines.copyPageTemplate.request());

    yield api.post(`${PAGE_TEMPLATES_PATH}/${pageTemplateId}/copy`);

    if (projectId) {
      yield put(PageTemplatesRoutines.fetchPageTemplates.trigger({ projectId }));
    }

    yield put(PageTemplatesRoutines.copyPageTemplate.success());
  } catch (error) {
    reportError(error);
    yield put(PageTemplatesRoutines.copyPageTemplate.failure(error));
  } finally {
    yield put(PageTemplatesRoutines.copyPageTemplate.fulfill());
  }
}

export function* watchPageTemplates() {
  yield all([
    takeLatest(PageTemplatesRoutines.fetchPageTemplates.TRIGGER, fetchPageTemplates),
    takeLatest(PageTemplatesRoutines.fetchPageTemplate.TRIGGER, fetchPageTemplate),
    takeLatest(PageTemplatesRoutines.createPageTemplate.TRIGGER, createPageTemplate),
    takeLatest(PageTemplatesRoutines.updatePageTemplate.TRIGGER, updatePageTemplate),
    takeLatest(PageTemplatesRoutines.removePageTemplate.TRIGGER, removePageTemplate),
    takeLatest(PageTemplatesRoutines.copyPageTemplate.TRIGGER, copyPageTemplate),
  ]);
}
