import { all, put, takeLatest } from 'redux-saga/effects';

import reportError from '../../shared/utils/reportError';
import api from '../../shared/services/api';
import { BlockTemplatesRoutines } from './blockTemplates.redux';
import { ProjectRoutines } from '../project';
import { BLOCK_TEMPLATES_PATH, PROJECTS_PATH } from '../../shared/utils/api.constants';

function* fetchBlockTemplates({ payload: { projectId, raw } }) {
  try {
    yield put(BlockTemplatesRoutines.fetchBlockTemplates.request());

    const queryRaw = raw ? '?raw_list=true' : '';
    const { data } = yield api.get(`${PROJECTS_PATH}/${projectId}${BLOCK_TEMPLATES_PATH}${queryRaw}`);

    yield put(ProjectRoutines.setProject.trigger(data.project));
    yield put(BlockTemplatesRoutines.fetchBlockTemplates.success(data.results));
  } catch (error) {
    reportError(error);
    yield put(BlockTemplatesRoutines.fetchBlockTemplates.failure(error));
  } finally {
    yield put(BlockTemplatesRoutines.fetchBlockTemplates.fulfill());
  }
}
function* fetchBlockTemplate({ payload: { blockTemplateId } }) {
  try {
    yield put(BlockTemplatesRoutines.fetchBlockTemplate.request());

    const { data } = yield api.get(`${BLOCK_TEMPLATES_PATH}/${blockTemplateId}`);

    yield put(ProjectRoutines.setProject.trigger(data.project));
    yield put(BlockTemplatesRoutines.fetchBlockTemplate.success(data.results));
  } catch (error) {
    reportError(error);
    yield put(BlockTemplatesRoutines.fetchBlockTemplate.failure(error));
  } finally {
    yield put(BlockTemplatesRoutines.fetchBlockTemplate.fulfill());
  }
}

function* createBlockTemplate({ payload: { projectId, formData } }) {
  try {
    yield put(BlockTemplatesRoutines.createBlockTemplate.request());

    const { data } = yield api.post(`${PROJECTS_PATH}/${projectId}${BLOCK_TEMPLATES_PATH}`, formData);

    yield put(ProjectRoutines.setProject.trigger(data.project));
    yield put(BlockTemplatesRoutines.createBlockTemplate.success(data.results));
  } catch (error) {
    reportError(error);
    yield put(BlockTemplatesRoutines.createBlockTemplate.failure(error));
  } finally {
    yield put(BlockTemplatesRoutines.createBlockTemplate.fulfill());
  }
}

function* updateBlockTemplate({ payload: { blockTemplateId, formData } }) {
  try {
    yield put(BlockTemplatesRoutines.updateBlockTemplate.request());

    const { data } = yield api.patch(`${BLOCK_TEMPLATES_PATH}/${blockTemplateId}`, formData);

    yield put(BlockTemplatesRoutines.updateBlockTemplate.success(data));
  } catch (error) {
    reportError(error);
    yield put(BlockTemplatesRoutines.updateBlockTemplate.failure(error));
  } finally {
    yield put(BlockTemplatesRoutines.updateBlockTemplate.fulfill());
  }
}

function* removeBlockTemplate({ payload: { blockTemplateId } }) {
  try {
    yield put(BlockTemplatesRoutines.removeBlockTemplate.request());

    const { data } = yield api.delete(`${BLOCK_TEMPLATES_PATH}/${blockTemplateId}`);

    yield put(BlockTemplatesRoutines.removeBlockTemplate.success(data));
  } catch (error) {
    reportError(error);
    yield put(BlockTemplatesRoutines.removeBlockTemplate.failure(error));
  } finally {
    yield put(BlockTemplatesRoutines.removeBlockTemplate.fulfill());
  }
}

export function* watchBlockTemplates() {
  yield all([
    takeLatest(BlockTemplatesRoutines.fetchBlockTemplates.TRIGGER, fetchBlockTemplates),
    takeLatest(BlockTemplatesRoutines.fetchBlockTemplate.TRIGGER, fetchBlockTemplate),
    takeLatest(BlockTemplatesRoutines.createBlockTemplate.TRIGGER, createBlockTemplate),
    takeLatest(BlockTemplatesRoutines.updateBlockTemplate.TRIGGER, updateBlockTemplate),
    takeLatest(BlockTemplatesRoutines.removeBlockTemplate.TRIGGER, removeBlockTemplate),
  ]);
}
