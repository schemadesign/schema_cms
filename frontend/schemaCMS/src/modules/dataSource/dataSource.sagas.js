import { all, put, takeLatest } from 'redux-saga/effects';

import { DataSourceRoutines } from './dataSource.redux';
import browserHistory from '../../shared/utils/history';

function* create({ payload }) {
  try {
    yield put(DataSourceRoutines.create.request());
    const data = {
      id: 1,
      status: 'draft',
    };

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
