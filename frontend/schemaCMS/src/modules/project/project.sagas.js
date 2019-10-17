import { all, put, takeLatest, select } from 'redux-saga/effects';
import { path } from 'ramda';

import { ProjectRoutines } from './project.redux';
import browserHistory from '../../shared/utils/history';
import api from '../../shared/services/api';
import { PROJECTS_PATH } from '../../shared/utils/api.constants';
import { PROJECT_OWNER } from './project.constants';
import { selectUserData } from '../userProfile';

const PAGE_SIZE = 1000;

function* fetchList() {
  try {
    yield put(ProjectRoutines.fetchList.request());

    const {
      data: { results = [] },
    } = yield api.get(`${PROJECTS_PATH}?page_size=${PAGE_SIZE}`);

    yield put(ProjectRoutines.fetchList.success(results));
  } catch (error) {
    yield put(ProjectRoutines.fetchList.failure(error));
  } finally {
    yield put(ProjectRoutines.fetchList.fulfill());
  }
}

function* createProject({ payload }) {
  try {
    yield put(ProjectRoutines.createProject.request());
    const currentUser = yield select(selectUserData);
    const parsedPayload = { ...payload, [PROJECT_OWNER]: currentUser.id };
    const { data } = yield api.post(PROJECTS_PATH, parsedPayload);

    yield put(ProjectRoutines.createProject.success(data));
    browserHistory.push('/project/');
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

    yield put(ProjectRoutines.fetchOne.success(data));
  } catch (error) {
    const detail = path(['response', 'data', 'detail'], error);
    const status = path(['response', 'status'], error);

    yield put(ProjectRoutines.fetchOne.failure({ id: payload.projectId, error: { detail, status } }));
  } finally {
    yield put(ProjectRoutines.fetchOne.fulfill());
  }
}

function* removeOne({ payload }) {
  try {
    yield put(ProjectRoutines.removeOne.request());
    yield api.delete(`${PROJECTS_PATH}/${payload.projectId}`);

    browserHistory.push('/project/');
    yield put(ProjectRoutines.removeOne.success());
  } catch (error) {
    yield put(ProjectRoutines.removeOne.failure(error));
  } finally {
    yield put(ProjectRoutines.removeOne.fulfill());
  }
}

export function* watchProject() {
  yield all([
    takeLatest(ProjectRoutines.fetchList.TRIGGER, fetchList),
    takeLatest(ProjectRoutines.fetchOne.TRIGGER, fetchOne),
    takeLatest(ProjectRoutines.createProject.TRIGGER, createProject),
    takeLatest(ProjectRoutines.removeOne.TRIGGER, removeOne),
  ]);
}
