import { all, put, takeLatest, select } from 'redux-saga/effects';
import { path } from 'ramda';

import { ProjectTypes, ProjectActions, ProjectRoutines } from './project.redux';
import browserHistory from '../../shared/utils/history';
import api from '../../shared/services/api';
import { PROJECTS_PATH } from '../../shared/utils/api.constants';
import { PROJECT_OWNER } from './project.constants';
import { selectUserData } from '../userProfile';

function* fetchProjectsList() {
  try {
    const { data } = yield api.get(PROJECTS_PATH);
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

function* fetchOne({ payload }) {
  try {
    yield put(ProjectRoutines.fetchOne.request());

    const { data } = yield api.get(`${PROJECTS_PATH}/${payload.projectId}`);
    debugger;
    yield put(ProjectRoutines.fetchOne.success(data));
    debugger;
  } catch (error) {
    const detail = path(['response', 'data', 'detail'], error);
    const status = path(['response', 'status'], error);

    yield put(ProjectRoutines.fetchOne.failure({ id, error: { detail, status } }));
  } finally {
    yield put(ProjectRoutines.fetchOne.fulfill());
  }
}

function* removeOne({ payload }) {
  try {
    yield put(ProjectRoutines.removeOne.request());
    yield api.delete(`${PROJECTS_PATH}/${payload.projectId}`);

    browserHistory.push('/project/list');
    yield put(ProjectRoutines.removeOne.success());
  } catch (error) {
    debugger;
    yield put(ProjectRoutines.removeOne.failure(error));
  } finally {
    debugger;
    yield put(ProjectRoutines.removeOne.fulfill());
  }
}

export function* watchProject() {
  yield all([
    takeLatest(ProjectTypes.FETCH_LIST, fetchProjectsList),
    takeLatest(ProjectRoutines.fetchOne.TRIGGER, fetchOne),
    takeLatest(ProjectRoutines.createProject.TRIGGER, createProject),
    takeLatest(ProjectRoutines.removeOne.TRIGGER, removeOne),
  ]);
}
