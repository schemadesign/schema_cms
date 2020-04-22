import { all, put, takeLatest } from 'redux-saga/effects';
import reportError from '../../shared/utils/reportError';

import { SectionsRoutines } from './sections.redux';
import api from '../../shared/services/api';
import { SECTIONS_PATH, PROJECTS_PATH } from '../../shared/utils/api.constants';
import { ProjectRoutines } from '../project';

function* fetchSections({ payload: { projectId } }) {
  try {
    yield put(SectionsRoutines.fetchSections.request());

    const { data } = yield api.get(`${PROJECTS_PATH}/${projectId}${SECTIONS_PATH}`);

    yield put(ProjectRoutines.setProject.trigger(data.project));
    yield put(SectionsRoutines.fetchSections.success(data.results));
  } catch (error) {
    reportError(error);
    yield put(SectionsRoutines.fetchSections.failure(error));
  } finally {
    yield put(SectionsRoutines.fetchSections.fulfill());
  }
}

function* fetchInternalConnections({ payload: { projectId } }) {
  try {
    yield put(SectionsRoutines.fetchInternalConnections.request());

    const { data } = yield api.get(`${PROJECTS_PATH}/${projectId}${SECTIONS_PATH}/internal-connections`);

    yield put(SectionsRoutines.fetchInternalConnections.success(data.results));
  } catch (error) {
    reportError(error);
    yield put(SectionsRoutines.fetchInternalConnections.failure(error));
  } finally {
    yield put(SectionsRoutines.fetchInternalConnections.fulfill());
  }
}

function* fetchSection({ payload: { sectionId } }) {
  try {
    yield put(SectionsRoutines.fetchSection.request());

    const { data } = yield api.get(`${SECTIONS_PATH}/${sectionId}`);

    yield put(ProjectRoutines.setProject.trigger(data.project));
    yield put(SectionsRoutines.fetchSection.success(data.results));
  } catch (error) {
    reportError(error);
    yield put(SectionsRoutines.fetchSection.failure(error));
  } finally {
    yield put(SectionsRoutines.fetchSection.fulfill());
  }
}

function* createSection({ payload: { projectId, formData } }) {
  try {
    yield put(SectionsRoutines.createSection.request());

    const { data } = yield api.post(`${PROJECTS_PATH}/${projectId}${SECTIONS_PATH}`, formData);

    yield put(SectionsRoutines.createSection.success(data.results));
  } catch (error) {
    reportError(error);
    yield put(SectionsRoutines.createSection.failure(error));
  } finally {
    yield put(SectionsRoutines.createSection.fulfill());
  }
}

function* updateSection({ payload: { sectionId, formData } }) {
  try {
    yield put(SectionsRoutines.updateSection.request());

    const { data } = yield api.patch(`${SECTIONS_PATH}/${sectionId}`, formData);

    yield put(SectionsRoutines.updateSection.success(data));
  } catch (error) {
    reportError(error);
    yield put(SectionsRoutines.updateSection.failure(error));
  } finally {
    yield put(SectionsRoutines.updateSection.fulfill());
  }
}

function* removeSection({ payload: { sectionId } }) {
  try {
    yield put(SectionsRoutines.removeSection.request());

    const { data } = yield api.delete(`${SECTIONS_PATH}/${sectionId}`);

    yield put(SectionsRoutines.removeSection.success(data.results));
  } catch (error) {
    reportError(error);
    yield put(SectionsRoutines.removeSection.failure(error));
  } finally {
    yield put(SectionsRoutines.removeSection.fulfill());
  }
}

export function* watchSections() {
  yield all([
    takeLatest(SectionsRoutines.fetchSections.TRIGGER, fetchSections),
    takeLatest(SectionsRoutines.fetchInternalConnections.TRIGGER, fetchInternalConnections),
    takeLatest(SectionsRoutines.fetchSection.TRIGGER, fetchSection),
    takeLatest(SectionsRoutines.createSection.TRIGGER, createSection),
    takeLatest(SectionsRoutines.updateSection.TRIGGER, updateSection),
    takeLatest(SectionsRoutines.removeSection.TRIGGER, removeSection),
  ]);
}
