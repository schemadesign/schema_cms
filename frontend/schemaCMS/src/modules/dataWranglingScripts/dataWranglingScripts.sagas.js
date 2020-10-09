import { all, put, takeLatest, select } from 'redux-saga/effects';
import { isEmpty } from 'ramda';

import { DataWranglingScriptsRoutines } from './dataWranglingScripts.redux';
import api from '../../shared/services/api';
import {
  DATA_SOURCES_PATH,
  DATA_WRANGLING_JOB_PATH,
  DATA_WRANGLING_SCRIPTS_PATH,
} from '../../shared/utils/api.constants';
import browserHistory from '../../shared/utils/history';

import { selectDataSource } from '../dataSource';
import { STEPS_PAGE } from '../dataSource/dataSource.constants';
import { selectDataWranglingScripts } from './dataWranglingScripts.selectors';
import { selectProject } from '../project';

function* fetchList({ payload: { dataSourceId, fromScript = false, uploadScript = false } }) {
  try {
    yield put(DataWranglingScriptsRoutines.fetchList.request());

    if (!fromScript) {
      yield put(DataWranglingScriptsRoutines.clearCustomScripts());
    }

    const scripts = yield select(selectDataWranglingScripts);

    if (fromScript && !isEmpty(scripts)) {
      yield put(DataWranglingScriptsRoutines.fetchList.success({ fromScript }));
      return;
    }

    const { data } = yield api.get(`${DATA_SOURCES_PATH}/${dataSourceId}${DATA_WRANGLING_SCRIPTS_PATH}`);
    const dataSource = yield select(selectDataSource);

    yield put(DataWranglingScriptsRoutines.fetchList.success({ data, dataSource, uploadScript }));
  } catch (e) {
    yield put(DataWranglingScriptsRoutines.fetchList.failure());
  } finally {
    yield put(DataWranglingScriptsRoutines.fetchList.fulfill());
  }
}

function* sendList({ payload: { steps, dataSourceId } }) {
  try {
    yield put(DataWranglingScriptsRoutines.sendList.request());

    yield api.post(`${DATA_SOURCES_PATH}/${dataSourceId}${DATA_WRANGLING_JOB_PATH}`, { steps });

    const project = yield select(selectProject);

    browserHistory.push(`/project/${project.id}/datasource/`);
    yield put(DataWranglingScriptsRoutines.sendList.success());
  } catch (e) {
    yield put(DataWranglingScriptsRoutines.sendList.failure());
  } finally {
    yield put(DataWranglingScriptsRoutines.sendList.fulfill());
  }
}

function* uploadScript({ payload: { script, dataSourceId } }) {
  try {
    yield put(DataWranglingScriptsRoutines.uploadScript.request());
    const formData = new FormData();
    const headers = { 'Content-Type': 'multipart/form-data' };

    formData.append('file', script);

    yield api.post(`${DATA_SOURCES_PATH}/${dataSourceId}/script-upload`, formData, { headers });

    yield fetchList({ payload: { dataSourceId, uploadScript: true } });
    yield put(DataWranglingScriptsRoutines.uploadScript.success());
  } catch (e) {
    yield put(DataWranglingScriptsRoutines.uploadScript.failure());
  } finally {
    yield put(DataWranglingScriptsRoutines.uploadScript.fulfill());
  }
}

function* fetchOne({ payload: { scriptId } }) {
  try {
    yield put(DataWranglingScriptsRoutines.fetchOne.request());

    const { data } = yield api.get(`${DATA_WRANGLING_SCRIPTS_PATH}/${scriptId}`);

    yield put(DataWranglingScriptsRoutines.fetchOne.success(data));
  } catch (error) {
    yield put(DataWranglingScriptsRoutines.fetchOne.failure(error));
  } finally {
    yield put(DataWranglingScriptsRoutines.fetchOne.fulfill());
  }
}

function* setImageScrapingFields({ payload }) {
  try {
    yield put(DataWranglingScriptsRoutines.setImageScrapingFields.request());

    yield put(DataWranglingScriptsRoutines.setImageScrapingFields.success(payload));
    browserHistory.push(`/datasource/${payload.dataSourceId}/${STEPS_PAGE}`, { fromScript: true });
  } catch (error) {
    yield put(DataWranglingScriptsRoutines.setImageScrapingFields.failure(error));
  } finally {
    yield put(DataWranglingScriptsRoutines.setImageScrapingFields.fulfill());
  }
}

export function* watchDataWranglingScripts() {
  yield all([
    takeLatest(DataWranglingScriptsRoutines.fetchList.TRIGGER, fetchList),
    takeLatest(DataWranglingScriptsRoutines.sendList.TRIGGER, sendList),
    takeLatest(DataWranglingScriptsRoutines.uploadScript.TRIGGER, uploadScript),
    takeLatest(DataWranglingScriptsRoutines.fetchOne.TRIGGER, fetchOne),
    takeLatest(DataWranglingScriptsRoutines.setImageScrapingFields.TRIGGER, setImageScrapingFields),
  ]);
}
