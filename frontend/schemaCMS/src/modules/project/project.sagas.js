import { all, put, takeLatest } from 'redux-saga/effects';
import reportError from '../../shared/utils/reportError';

import { ProjectRoutines, ProjectActions } from './project.redux';
import api from '../../shared/services/api';
import { PROJECTS_PATH } from '../../shared/utils/api.constants';

function* fetchProjectsList() {
  try {
    yield put(fetchList.request());

    const { data } = yield api.get(PROJECTS_PATH);

    yield put(ProjectRoutines.fetchList.success(data));
    yield put(ProjectActions.fetchListSuccess(data));
  } catch (error) {
    yield put(ProjectRoutines.fetchList.failure(error));
  } finally {
    yield put(ProjectRoutines.fetchList.fulfill());
  }
}

export function* watchProject() {
  yield all([takeLatest(ProjectRoutines.fetchList.TRIGGER, fetchProjectsList)]);
}
