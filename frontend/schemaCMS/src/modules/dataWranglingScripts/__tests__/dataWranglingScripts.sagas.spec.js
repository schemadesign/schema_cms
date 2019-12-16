import { expectSaga } from 'redux-saga-test-plan';
import { select } from 'redux-saga/effects';
import Immutable from 'seamless-immutable';
import { OK } from 'http-status-codes';
import nock from 'nock';

import mockApi from '../../../shared/utils/mockApi';
import { DATA_SOURCES_PATH, DATA_WRANGLING_SCRIPTS_PATH } from '../../../shared/utils/api.constants';
import { watchDataWranglingScripts } from '../dataWranglingScripts.sagas';
import { DataWranglingScriptsRoutines } from '../dataWranglingScripts.redux';
import { SCRIPT_TYPES } from '../dataWranglingScripts.constants';
import { selectDataSource } from '../../dataSource';

const { DEFAULT, UPLOADED } = SCRIPT_TYPES;

describe('DataWranglingScripts: sagas', () => {
  const defaultState = Immutable({});

  beforeEach(() => {
    nock.cleanAll();
  });

  describe('fetchList', () => {
    it('should dispatch a success action', async () => {
      const responseData = [
        { id: 1, name: 'name 1', specs: {}, isPredefined: true },
        { id: 2, name: 'name 2', specs: {}, isPredefined: true },
      ];
      const fetchListData = [
        {...responseData[0], type: DEFAULT },
        {...responseData[1], type: DEFAULT },
      ];
      const payload = { dataSourceId: 1 };

      mockApi.get(`${DATA_SOURCES_PATH}/${payload.dataSourceId}${DATA_WRANGLING_SCRIPTS_PATH}`).reply(OK, responseData);

      await expectSaga(watchDataWranglingScripts)
        .withState(defaultState)
        .put(DataWranglingScriptsRoutines.fetchList.success(fetchListData))
        .dispatch(DataWranglingScriptsRoutines.fetchList(payload))
        .silentRun();
    });
  });

  describe('sendList', () => {
    it('should dispatch a success action', async () => {
      const payload = { dataSourceId: '1', steps: ['data 1', 'data 2'] };
      const selectedProject = { id: 1, project: 1 };

      mockApi.post(`${DATA_SOURCES_PATH}/${payload.dataSourceId}/job`, { steps: payload.steps }).reply(OK);

      await expectSaga(watchDataWranglingScripts)
        .withState(defaultState)
        .provide([[select(selectDataSource), selectedProject]])
        .put(DataWranglingScriptsRoutines.sendList.success())
        .dispatch(DataWranglingScriptsRoutines.sendList(payload))
        .silentRun();
    });
  });

  describe('uploadScript', () => {
    it('should dispatch a success action', async () => {
      const options = {
        headers: { 'Content-Type': 'multipart/form-data' },
      };
      const payload = { dataSourceId: '1', script: new File(['foo'], 'foo.py', { type: 'text/plain' }) };
      const responseData = [
        { id: 1, name: 'name 1', specs: {}, isPredefined: true },
        { id: 2, name: 'name 2', specs: {}, isPredefined: true },
        { id: 3, name: 'name 3', specs: {}, isPredefined: false },
      ];
      const fetchListData = [
        {...responseData[2], type: UPLOADED },
        {...responseData[0], type: DEFAULT },
        {...responseData[1], type: DEFAULT },
      ];

      mockApi
        .post(`${DATA_SOURCES_PATH}/${payload.dataSourceId}/script-upload`, /form-data; name="file"[^]*file/m, options)
        .reply(OK);
      mockApi.get(`${DATA_SOURCES_PATH}/${payload.dataSourceId}/script`).reply(OK, responseData);

      await expectSaga(watchDataWranglingScripts)
        .withState(defaultState)
        .put(DataWranglingScriptsRoutines.fetchList.success(fetchListData))
        .put(DataWranglingScriptsRoutines.uploadScript.success())
        .dispatch(DataWranglingScriptsRoutines.uploadScript(payload))
        .silentRun();
    });
  });

  describe('fetchOne', () => {
    it('should dispatch a success action', async () => {
      const payload = { scriptId: '1' };
      const responseData = {
        description: 'file description',
        code: 'df.columns = map(str.lower, df.columns)',
      };

      mockApi.get(`/script/${payload.scriptId}`).reply(OK, responseData);

      await expectSaga(watchDataWranglingScripts)
        .withState(defaultState)
        .put(DataWranglingScriptsRoutines.fetchOne.success(responseData))
        .dispatch(DataWranglingScriptsRoutines.fetchOne(payload))
        .silentRun();
    });
  });

  describe('setImageScrapingFields', () => {
    it('should dispatch a success action', async () => {
      const payload = { scriptId: '1', imageScrapingFields: ['data 1', 'data 2'] };

      await expectSaga(watchDataWranglingScripts)
        .withState(defaultState)
        .put(DataWranglingScriptsRoutines.setImageScrapingFields.success(payload))
        .dispatch(DataWranglingScriptsRoutines.setImageScrapingFields(payload))
        .silentRun();
    });
  });
});
