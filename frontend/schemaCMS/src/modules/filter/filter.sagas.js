import { all, put, takeLatest } from 'redux-saga/effects';

import { FilterRoutines } from './filter.redux';
import api from '../../shared/services/api';

function* fetchList({ payload: { dataSourceId } }) {
  try {
    yield put(FilterRoutines.fetchList.request());

    const { data } = yield api.get(`datasources/${dataSourceId}/filters`);

    yield put(FilterRoutines.fetchList.success(data));
  } catch (e) {
    yield put(FilterRoutines.fetchList.failure(e));
  } finally {
    yield put(FilterRoutines.fetchList.fulfill());
  }
}

function* setFilters({ payload: { dataSourceId, active, inactive } }) {
  try {
    yield put(FilterRoutines.fetchList.request());

    const { data } = yield api.patch(`datasources/${dataSourceId}/filters/set-filters`, { active, inactive });

    yield put(FilterRoutines.fetchList.success(data));
  } catch (e) {
    yield put(FilterRoutines.fetchList.failure(e));
  } finally {
    yield put(FilterRoutines.fetchList.fulfill());
  }
}

export function* watchFilter() {
  yield all([
    takeLatest(FilterRoutines.fetchList.TRIGGER, fetchList),
    takeLatest(FilterRoutines.setFilters.TRIGGER, setFilters),
  ]);
}
