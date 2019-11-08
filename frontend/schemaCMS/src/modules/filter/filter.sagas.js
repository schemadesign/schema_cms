import { all, put, takeLatest } from 'redux-saga/effects';

import { FilterRoutines } from './filter.redux';
import api from '../../shared/services/api';
import { DATA_SOURCES_PATH, FILTERS_PATH } from '../../shared/utils/api.constants';
import browserHistory from '../../shared/utils/history';
import { FILTERS_STEP, VIEWS_STEP } from '../dataSource/dataSource.constants';
import { ROUTES } from '../../routes';

function* fetchList({ payload: { dataSourceId } }) {
  try {
    yield put(FilterRoutines.fetchList.request());

    const { data } = yield api.get(`${DATA_SOURCES_PATH}/${dataSourceId}/filters`);

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

    browserHistory.push(`${ROUTES.DATA_SOURCE}/${dataSourceId}/${VIEWS_STEP}`);

    yield put(FilterRoutines.setFilters.success(data));
  } catch (e) {
    yield put(FilterRoutines.setFilters.failure(e));
  } finally {
    yield put(FilterRoutines.setFilters.fulfill());
  }
}

function* createFilter({ payload: { dataSourceId, formData } }) {
  try {
    yield put(FilterRoutines.createFilter.request());

    const { data } = yield api.post(`${DATA_SOURCES_PATH}/${dataSourceId}/filters`, { ...formData, isActive: true });

    browserHistory.push(`${ROUTES.DATA_SOURCE}/${dataSourceId}/${FILTERS_STEP}`);

    yield put(FilterRoutines.createFilter.success(data));
  } catch (e) {
    yield put(FilterRoutines.createFilter.failure(e));
  } finally {
    yield put(FilterRoutines.createFilter.fulfill());
  }
}

function* fetchFilter({ payload: { filterId } }) {
  try {
    yield put(FilterRoutines.fetchFilter.request());

    const { data } = yield api.get(`${FILTERS_PATH}/${filterId}`);

    yield put(FilterRoutines.fetchFilter.success(data));
  } catch (e) {
    yield put(FilterRoutines.fetchFilter.failure(e));
  } finally {
    yield put(FilterRoutines.fetchFilter.fulfill());
  }
}

function* updateFilter({ payload: { filterId, dataSourceId, formData } }) {
  try {
    yield put(FilterRoutines.updateFilter.request());

    const { data } = yield api.put(`${FILTERS_PATH}/${filterId}`, { ...formData });
    browserHistory.push(`${ROUTES.DATA_SOURCE}/${dataSourceId}/${FILTERS_STEP}`);

    yield put(FilterRoutines.updateFilter.success(data));
  } catch (e) {
    yield put(FilterRoutines.updateFilter.failure(e));
  } finally {
    yield put(FilterRoutines.updateFilter.fulfill());
  }
}

function* removeFilter({ payload: { filterId, dataSourceId } }) {
  try {
    yield put(FilterRoutines.removeFilter.request());

    const { data } = yield api.delete(`${FILTERS_PATH}/${filterId}`);
    browserHistory.push(`${ROUTES.DATA_SOURCE}/${dataSourceId}/${FILTERS_STEP}`);

    yield put(FilterRoutines.removeFilter.success(data));
  } catch (e) {
    yield put(FilterRoutines.removeFilter.failure(e));
  } finally {
    yield put(FilterRoutines.removeFilter.fulfill());
  }
}

export function* watchFilter() {
  yield all([
    takeLatest(FilterRoutines.fetchList.TRIGGER, fetchList),
    takeLatest(FilterRoutines.setFilters.TRIGGER, setFilters),
    takeLatest(FilterRoutines.createFilter.TRIGGER, createFilter),
    takeLatest(FilterRoutines.fetchFilter.TRIGGER, fetchFilter),
    takeLatest(FilterRoutines.removeFilter.TRIGGER, removeFilter),
    takeLatest(FilterRoutines.updateFilter.TRIGGER, updateFilter),
  ]);
}
