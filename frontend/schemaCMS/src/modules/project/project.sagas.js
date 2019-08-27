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

export function* watchProject() {
  yield all([takeLatest(ProjectTypes.FETCH_LIST, fetchProjectsList)]);
}
