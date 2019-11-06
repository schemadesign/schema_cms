import { all, put, takeLatest } from 'redux-saga/effects';

import { FilterRoutines } from './filter.redux';
import api from '../../shared/services/api';
import { DATA_SOURCE_PATH, DATA_SOURCES_PATH } from '../../shared/utils/api.constants';
import browserHistory from '../../shared/utils/history';
import { FILTERS_STEP } from '../dataSource/dataSource.constants';

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

    const { data } = yield api.post(`${DATA_SOURCES_PATH}/${dataSourceId}/set-filters`, { active, inactive });

    yield put(FilterRoutines.setFilters.success(data));
  } catch (e) {
    yield put(FilterRoutines.setFilters.failure(e));
  } finally {
    yield put(FilterRoutines.setFilters.fulfill());
  }
}

function* createFilter({ payload: { dataSourceId, formData } }) {
  try {
    yield put(FilterRoutines.setFilters.request());

    const { data } = yield api.post(`datasources/${dataSourceId}/filters`, { ...formData, isActive: true });
    browserHistory.push(`${DATA_SOURCE_PATH}/${dataSourceId}/${FILTERS_STEP}`);
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
    takeLatest(FilterRoutines.createFilter.TRIGGER, createFilter),
  ]);
}
