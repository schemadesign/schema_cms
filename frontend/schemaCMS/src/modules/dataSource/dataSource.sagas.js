import { all, put, takeLatest } from 'redux-saga/effects';

import { DataSourceRoutines } from './dataSource.redux';
import browserHistory from '../../shared/utils/history';
import api from '../../shared/services/api';
import { DATA_SOURCE_PATH, PROJECTS_PATH } from '../../shared/utils/api.constants';

function* create({ payload }) {
  try {
    yield put(DataSourceRoutines.create.request());

    const requestData = {
      project: payload.projectId,
      name: null,
      type: 'file',
      file: null,
    };
    const { data } = yield api.post(`${PROJECTS_PATH}/${payload.projectId}${DATA_SOURCE_PATH}`, requestData);

    browserHistory.push(`/project/${payload.projectId}/dataSource/${data.id}`);
    yield put(DataSourceRoutines.create.success(data));
  } catch (error) {
    yield put(DataSourceRoutines.create.failure(error));
  } finally {
    yield put(DataSourceRoutines.create.fulfill());
  }
}

export function* watchDataSource() {
  yield all([takeLatest(DataSourceRoutines.create.TRIGGER, create)]);
}
