import { expectSaga } from 'redux-saga-test-plan';
import { select } from 'redux-saga/effects';
import Immutable from 'seamless-immutable';
import { OK } from 'http-status-codes';

import mockApi from '../../../shared/utils/mockApi';
import { DATA_SOURCES_PATH, DATA_WRANGLING_SCRIPTS_PATH } from '../../../shared/utils/api.constants';
import { watchDataWranglingScripts } from '../dataWranglingScripts.sagas';
import { DataWranglingScriptsRoutines } from '../dataWranglingScripts.redux';
import { selectDataSource } from '../../dataSource';
import { selectDataWranglingScripts } from '../dataWranglingScripts.selectors';
import { selectProject } from '../../project';

describe('DataWranglingScripts: sagas', () => {
  const defaultState = Immutable({});

  describe('fetchList', () => {
    it('should dispatch a success action', async () => {
      const responseData = [
        { id: 1, name: 'name 1', specs: {}, isPredefined: true },
        { id: 2, name: 'name 2', specs: {}, isPredefined: true },
      ];
      const dataSource = {
        activeJob: {
          scripts: [{ id: 1, execOrder: 0 }],
        },
      };
      const scripts = [];
      const payload = { dataSourceId: 1, fromScript: false };
      const successPayload = { data: responseData, dataSource, uploadScript: false };

      mockApi.get(`${DATA_SOURCES_PATH}/${payload.dataSourceId}${DATA_WRANGLING_SCRIPTS_PATH}`).reply(OK, responseData);

      await expectSaga(watchDataWranglingScripts)
        .withState(defaultState)
        .provide([[select(selectDataSource), dataSource], [select(selectDataWranglingScripts), scripts]])
        .put(DataWranglingScriptsRoutines.fetchList.success(successPayload))
        .dispatch(DataWranglingScriptsRoutines.fetchList(payload))
        .silentRun();
    });

    it('should dispatch a success action with fromScript', async () => {
      const payload = { dataSourceId: 1, fromScript: true };

      const successPayload = { fromScript: true };
      const scripts = [{ id: 1 }];

      await expectSaga(watchDataWranglingScripts)
        .withState(defaultState)
        .provide([[select(selectDataWranglingScripts), scripts]])
        .put(DataWranglingScriptsRoutines.fetchList.success(successPayload))
        .dispatch(DataWranglingScriptsRoutines.fetchList(payload))
        .silentRun();
    });

    it('should trigger clearCustomScripts', async () => {
      const payload = { dataSourceId: 1, fromScript: false };

      mockApi.get(`${DATA_SOURCES_PATH}/${payload.dataSourceId}${DATA_WRANGLING_SCRIPTS_PATH}`).reply(OK);

      await expectSaga(watchDataWranglingScripts)
        .withState(defaultState)
        .put(DataWranglingScriptsRoutines.clearCustomScripts.trigger())
        .dispatch(DataWranglingScriptsRoutines.fetchList(payload))
        .silentRun();
    });
  });

  describe('sendList', () => {
    it('should dispatch a success action', async () => {
      const payload = { dataSourceId: '1', steps: ['data 1', 'data 2'] };
      const selectedProject = { id: 1, name: 1 };
      const response = {
        project: {
          id: 1,
        },
      };

      mockApi.post(`${DATA_SOURCES_PATH}/${payload.dataSourceId}/job`, { steps: payload.steps }).reply(OK, response);

      await expectSaga(watchDataWranglingScripts)
        .withState(defaultState)
        .provide([[select(selectProject), selectedProject]])
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
      const payload = {
        dataSourceId: '1',
        script: new File(['foo'], 'foo.py', { type: 'text/plain' }),
      };
      const responseData = [
        { id: 1, name: 'name 1', specs: {}, isPredefined: true },
        { id: 2, name: 'name 2', specs: {}, isPredefined: true },
        { id: 3, name: 'name 3', specs: {}, isPredefined: false },
      ];

      const dataSource = {
        activeJob: {
          scripts: [{ id: 1, execOrder: 0 }],
        },
      };

      const fetchListSuccessPayload = {
        data: responseData,
        dataSource,
        uploadScript: true,
      };

      mockApi
        .post(`${DATA_SOURCES_PATH}/${payload.dataSourceId}/script-upload`, /form-data; name="file"[^]*file/m, options)
        .reply(OK);
      mockApi.get(`${DATA_SOURCES_PATH}/${payload.dataSourceId}/script`).reply(OK, responseData);

      await expectSaga(watchDataWranglingScripts)
        .withState(defaultState)
        .provide([[select(selectDataSource), dataSource]])
        .put(DataWranglingScriptsRoutines.fetchList.success(fetchListSuccessPayload))
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
