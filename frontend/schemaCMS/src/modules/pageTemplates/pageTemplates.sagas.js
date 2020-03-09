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

    yield put(ProjectRoutines.setProject.trigger(data.project));
    yield put(PageTemplatesRoutines.fetchPageTemplates.success(data.results));
  } catch (error) {
    reportError(error);
    yield put(PageTemplatesRoutines.fetchPageTemplates.failure(error));
  } finally {
    yield put(PageTemplatesRoutines.fetchPageTemplates.fulfill());
  }
}

export function* watchPageTemplates() {
  yield all([takeLatest(PageTemplatesRoutines.fetchPageTemplates.TRIGGER, fetchPageTemplates)]);
}
