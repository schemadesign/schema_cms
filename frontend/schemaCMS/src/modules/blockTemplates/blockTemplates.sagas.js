import { all, put, takeLatest } from 'redux-saga/effects';
import reportError from '../../shared/utils/reportError';

import api from '../../shared/services/api';
import { BlockTemplatesRoutines } from './blockTemplates.redux';
import { ProjectRoutines } from '../project';
import { BLOCK_TEMPLATES_PATH, PROJECTS_PATH } from '../../shared/utils/api.constants';

function* fetchBlocks({ payload: { projectId } }) {
  try {
    yield put(BlockTemplatesRoutines.fetchBlocks.request());

    const { data } = yield api.get(`${PROJECTS_PATH}/${projectId}${BLOCK_TEMPLATES_PATH}`);

    yield put(ProjectRoutines.setProject.trigger(data.project));
    yield put(BlockTemplatesRoutines.fetchBlocks.success(data.results));
  } catch (error) {
    reportError(error);
    yield put(BlockTemplatesRoutines.fetchBlocks.failure(error));
  } finally {
    yield put(BlockTemplatesRoutines.fetchBlocks.fulfill());
  }
}

export function* watchBlockTemplates() {
  yield all([takeLatest(BlockTemplatesRoutines.fetchBlocks.TRIGGER, fetchBlocks)]);
}
