import { all, put, takeLatest } from 'redux-saga/effects';

import { PageRoutines } from './page.redux';
import api from '../../shared/services/api';
import { PAGES_PATH, DIRECTORIES_PATH } from '../../shared/utils/api.constants';
import browserHistory from '../../shared/utils/history';

function* fetchList({ payload: { directoryId } }) {
  try {
    yield put(PageRoutines.fetchList.request());

    const { data } = yield api.get(`${DIRECTORIES_PATH}/${directoryId}${PAGES_PATH}`);

    yield put(PageRoutines.fetchList.success(data));
  } catch (e) {
    yield put(PageRoutines.fetchList.failure(e));
  } finally {
    yield put(PageRoutines.fetchList.fulfill());
  }
}

function* create({ payload: { directoryId, ...payload } }) {
  try {
    yield put(PageRoutines.create.request());

    const { data } = yield api.post(`${DIRECTORIES_PATH}/${directoryId}${PAGES_PATH}`, { ...payload });

    yield put(PageRoutines.create.success(data));
    browserHistory.push(`/directory/${directoryId}`);
  } catch (e) {
    yield put(PageRoutines.create.failure(e));
  } finally {
    yield put(PageRoutines.create.fulfill());
  }
}

export function* watchPage() {
  yield all([takeLatest(PageRoutines.fetchList.TRIGGER, fetchList), takeLatest(PageRoutines.create.TRIGGER, create)]);
}
