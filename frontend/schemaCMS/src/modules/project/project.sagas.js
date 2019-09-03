import { all, put, takeLatest } from 'redux-saga/effects';
import { path } from 'ramda';

import { ProjectTypes, ProjectActions, ProjectRoutines } from './project.redux';
import api from '../../shared/services/api';
import { PROJECTS_PATH } from '../../shared/utils/api.constants';

function* fetchProjectsList() {
  try {
    const { data } = yield api.get(PROJECTS_PATH);
    const { results = [] } = data;

    yield put(ProjectActions.fetchListSuccess(results));
  } catch (error) {
    yield put(ProjectActions.fetchListError(error));
  }
}

function* createProject() {
  //should call backend
}

function* fetchOne({ id }) {
  try {
    const { data } = yield api.get(`${PROJECTS_PATH}/${id}`);

    yield put(ProjectActions.fetchOneSuccess(data));
  } catch (error) {
    const detail = path(['response', 'data', 'detail'], error);
    const status = path(['response', 'status'], error);

    yield put(ProjectActions.fetchOneError({ id, error: { detail, status } }));
  }
}

export function* watchProject() {
  yield all([
    takeLatest(ProjectTypes.FETCH_LIST, fetchProjectsList),
    takeLatest(ProjectTypes.FETCH_ONE, fetchOne),
    takeLatest(ProjectRoutines.createProject.TRIGGER, createProject),
  ]);
}
