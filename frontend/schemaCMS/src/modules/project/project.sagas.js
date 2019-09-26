import { all, put, takeLatest, select } from 'redux-saga/effects';
import { path } from 'ramda';

import { ProjectTypes, ProjectActions, ProjectRoutines } from './project.redux';
import browserHistory from '../../shared/utils/history';
import api from '../../shared/services/api';
import { PROJECTS_PATH } from '../../shared/utils/api.constants';
import { PROJECT_OWNER } from './project.constants';
import { selectUserData } from '../userProfile';

const PAGE_SIZE = 1000;

function* fetchProjectsList() {
  try {
    const { data } = yield api.get(`${PROJECTS_PATH}?page_size=${PAGE_SIZE}`);
    const { results = [] } = data;

    yield put(ProjectActions.fetchListSuccess(results));
  } catch (error) {
    yield put(ProjectActions.fetchListError(error));
  }
}

function* createProject({ payload }) {
  try {
    yield put(ProjectRoutines.createProject.request());
    const currentUser = yield select(selectUserData);
    const parsedPayload = { ...payload, [PROJECT_OWNER]: currentUser.id };
    const { data } = yield api.post(PROJECTS_PATH, parsedPayload);

    yield put(ProjectActions.createProjectSuccess(data));
    yield put(ProjectRoutines.createProject.success(data));
    browserHistory.push('/project/list');
  } catch (e) {
    yield put(ProjectRoutines.createProject.failure());
  } finally {
    yield put(ProjectRoutines.createProject.fulfill());
  }
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
