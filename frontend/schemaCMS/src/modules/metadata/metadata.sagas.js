import { all, put, takeLatest } from 'redux-saga/effects';
import reportError from '../../shared/utils/reportError';

import { MetadataRoutines } from './metadata.redux';
import api from '../../shared/services/api';
import { METADATA_PATH, DATA_SOURCES_PATH } from '../../shared/utils/api.constants';

function* fetchMetadata({ payload: { dataSourceId } }) {
  try {
    yield put(MetadataRoutines.fetchMetadata.request());
    const { data } = yield api.get(`${DATA_SOURCES_PATH}/${dataSourceId}${METADATA_PATH}`);

    yield put(MetadataRoutines.fetchMetadata.success(data.results.data));
  } catch (error) {
    reportError(error);
    yield put(MetadataRoutines.fetchMetadata.failure(error));
  } finally {
    yield put(MetadataRoutines.fetchMetadata.fulfill());
  }
}

function* updateMetadata({ payload: { dataSourceId, formData } }) {
  try {
    yield put(MetadataRoutines.updateMetadata.request());
    const { data } = yield api.patch(`${DATA_SOURCES_PATH}/${dataSourceId}${METADATA_PATH}`, { data: formData });

    yield put(MetadataRoutines.updateMetadata.success(data.results.data));
  } catch (error) {
    reportError(error);
    yield put(MetadataRoutines.updateMetadata.failure(error));
  } finally {
    yield put(MetadataRoutines.updateMetadata.fulfill());
  }
}

export function* watchMetadata() {
  yield all([
    takeLatest(MetadataRoutines.fetchMetadata.TRIGGER, fetchMetadata),
    takeLatest(MetadataRoutines.updateMetadata.TRIGGER, updateMetadata),
  ]);
}
