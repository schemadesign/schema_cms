import { all, put, takeLatest } from 'redux-saga/effects';

import { ProjectTypes, ProjectActions } from './project.redux';
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

function* fetchOne({ id }) {
  try {
    const { data } = yield api.get(`${PROJECTS_PATH}/${id}`);

    yield put(ProjectActions.fetchOneSuccess(data));
  } catch (error) {
    yield put(ProjectActions.fetchOneError(error));
  }
}

export function* watchProject() {
  yield all([takeLatest(ProjectTypes.FETCH_LIST, fetchProjectsList), takeLatest(ProjectTypes.FETCH_ONE, fetchOne)]);
}
