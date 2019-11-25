import { all, put, takeLatest } from 'redux-saga/effects';

import { BlockRoutines } from './block.redux';
import api from '../../shared/services/api';
import { BLOCK_PATH, PAGES_PATH } from '../../shared/utils/api.constants';

function* fetchList({ payload: { pageId } }) {
  try {
    yield put(BlockRoutines.fetchList.request());

    const { data } = yield api.get(`${PAGES_PATH}/${pageId}${BLOCK_PATH}`);

    yield put(BlockRoutines.fetchList.success(data));
  } catch (e) {
    yield put(BlockRoutines.fetchList.failure(e));
  } finally {
    yield put(BlockRoutines.fetchList.fulfill());
  }
}

function* setBlocks({ payload: { pageId, active, inactive } }) {
  try {
    yield put(BlockRoutines.setBlocks.request());

    const { data } = yield api.post(`${PAGES_PATH}/${pageId}/set-blocks`, { active, inactive });

    yield put(BlockRoutines.setBlocks.success(data));
  } catch (e) {
    yield put(BlockRoutines.setBlocks.failure(e));
  } finally {
    yield put(BlockRoutines.setBlocks.fulfill());
  }
}

export function* watchBlock() {
  yield all([
    takeLatest(BlockRoutines.fetchList.TRIGGER, fetchList),
    takeLatest(BlockRoutines.setBlocks.TRIGGER, setBlocks),
  ]);
}
