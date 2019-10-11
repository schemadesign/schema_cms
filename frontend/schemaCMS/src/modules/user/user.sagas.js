import { all, takeLatest } from 'redux-saga/effects';

import { UserRoutines } from './user.redux';
import { PROJECTS_PATH } from '../../shared/utils/api.constants';

function* createUserCMS({ payload }) {
  try {
    yield UserRoutines.createUserCMS.request();

    yield api.post('/users', payload);

    yield UserRoutines.createUserCMS.success();
  } catch (error) {
    yield UserRoutines.createUserCMS.failure(error);
  } finally {
    yield UserRoutines.createUserCMS.fulfill();
  }
}

function* createUserProject({ payload: { projectId, userId } }) {
  try {
    yield UserRoutines.createUserProject.request();

    yield api.post(`${PROJECTS_PATH}/${projectId}`, { userId });

    yield UserRoutines.createUserProject.success();
  } catch (error) {
    yield UserRoutines.createUserProject.failure(error);
  } finally {
    yield UserRoutines.createUserProject.fulfill();
  }
}

export function* watchUser() {
  yield all([
    takeLatest(UserRoutines.createUserCMS.TRIGGER, createUserCMS),
    takeLatest(UserRoutines.createUserProject.TRIGGER, createUserProject),
  ]);
}
