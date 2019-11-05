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
    yield put(FilterRoutines.setFilters.request());

    const { data } = yield api.post(`datasources/${dataSourceId}/set-filters`, { active, inactive });

    yield put(FilterRoutines.setFilters.success(data));
  } catch (e) {
    yield put(FilterRoutines.setFilters.failure(e));
  } finally {
    yield put(FilterRoutines.setFilters.fulfill());
  }
}

export function* watchFilter() {
  yield all([
    takeLatest(FilterRoutines.fetchList.TRIGGER, fetchList),
    takeLatest(FilterRoutines.setFilters.TRIGGER, setFilters),
  ]);
}
