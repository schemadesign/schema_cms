import { all, put, takeLatest } from 'redux-saga/effects';

import { PageRoutines } from './page.redux';
import api from '../../shared/services/api';
import { PAGES_PATH, DIRECTORIES_PATH } from '../../shared/utils/api.constants';

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

export function* watchPage() {
  yield all([takeLatest(PageRoutines.fetchList.TRIGGER, fetchList)]);
}
