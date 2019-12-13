import { all, put, takeLatest } from 'redux-saga/effects';
import { forEach, keys, pipe, cond, equals, always, isNil, both, T, pickBy, complement } from 'ramda';

import { PageBlockRoutines } from './pageBlock.redux';
import api from '../../shared/services/api';
import { BLOCK_PATH, PAGES_PATH } from '../../shared/utils/api.constants';
import browserHistory from '../../shared/utils/history';
import { IMAGE_TYPE } from './pageBlock.constants';

const convertImages = images => images.reduce((result, item, index) => ({ [`image_${index}`]: item, ...result }), {});

const getBlockData = ({ name, images, type, ...rest }, blockType) =>
  cond([
    [both(equals(IMAGE_TYPE), () => isNil(images)), always({ name, type, content: '' })],
    [equals(IMAGE_TYPE), always({ name, type, ...convertImages(images), content: '' })],
    [T, always({ name, type, content: rest[`${type}-content`] })],
  ])(blockType || type);

function* fetchList({ payload: { pageId } }) {
  try {
    yield put(PageBlockRoutines.fetchList.request());

    const { data } = yield api.get(`${PAGES_PATH}/${pageId}${BLOCK_PATH}`);

    yield put(PageBlockRoutines.fetchList.success(data));
  } catch (e) {
    yield put(PageBlockRoutines.fetchList.failure(e));
  } finally {
    yield put(PageBlockRoutines.fetchList.fulfill());
  }
}

function* fetchOne({ payload: { blockId } }) {
  try {
    yield put(PageBlockRoutines.fetchOne.request());

    const { data } = yield api.get(`${BLOCK_PATH}/${blockId}`);

    yield put(PageBlockRoutines.fetchOne.success(data));
  } catch (e) {
    yield put(PageBlockRoutines.fetchOne.failure(e));
  } finally {
    yield put(PageBlockRoutines.fetchOne.fulfill());
  }
}

function* setBlocks({ payload: { pageId, active, inactive } }) {
  try {
    yield put(PageBlockRoutines.setBlocks.request());

    const { data } = yield api.post(`${PAGES_PATH}/${pageId}/set-blocks`, { active, inactive });

    yield put(PageBlockRoutines.setBlocks.success(data));
  } catch (e) {
    yield put(PageBlockRoutines.setBlocks.failure(e));
  } finally {
    yield put(PageBlockRoutines.setBlocks.fulfill());
  }
}

function* create({ payload: { pageId, ...restFields } }) {
  try {
    yield put(PageBlockRoutines.create.request());
    const formData = new FormData();
    const fields = getBlockData(restFields);

    pipe(
      keys,
      forEach(name => formData.append(name, fields[name]))
    )(fields);

    const { data } = yield api.post(`${PAGES_PATH}/${pageId}/blocks`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    yield put(PageBlockRoutines.create.success(data));
    browserHistory.push(`/page/${pageId}`);
  } catch (e) {
    yield put(PageBlockRoutines.create.failure(e));
  } finally {
    yield put(PageBlockRoutines.create.fulfill());
  }
}

function* update({ payload: { pageId, blockId, blockType, ...restFields } }) {
  try {
    yield put(PageBlockRoutines.update.request());
    const formData = new FormData();
    const fields = getBlockData(restFields, blockType);

    pipe(
      pickBy(complement(isNil)),
      keys,
      forEach(name => formData.append(name, fields[name]))
    )(fields);

    const { data } = yield api.patch(`${BLOCK_PATH}/${blockId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    yield put(PageBlockRoutines.update.success(data));
    browserHistory.push(`/page/${pageId}`);
  } catch (e) {
    yield put(PageBlockRoutines.update.failure(e));
  } finally {
    yield put(PageBlockRoutines.update.fulfill());
  }
}

function* removeOne({ payload: { blockId, pageId } }) {
  try {
    yield put(PageBlockRoutines.removeOne.request());

    yield api.delete(`${BLOCK_PATH}/${blockId}`);

    yield put(PageBlockRoutines.removeOne.success());
    browserHistory.push(`/page/${pageId}/`);
  } catch (e) {
    yield put(PageBlockRoutines.removeOne.failure(e));
  } finally {
    yield put(PageBlockRoutines.removeOne.fulfill());
  }
}

export function* watchPageBlock() {
  yield all([
    takeLatest(PageBlockRoutines.fetchList.TRIGGER, fetchList),
    takeLatest(PageBlockRoutines.fetchOne.TRIGGER, fetchOne),
    takeLatest(PageBlockRoutines.setBlocks.TRIGGER, setBlocks),
    takeLatest(PageBlockRoutines.create.TRIGGER, create),
    takeLatest(PageBlockRoutines.update.TRIGGER, update),
    takeLatest(PageBlockRoutines.removeOne.TRIGGER, removeOne),
  ]);
}
