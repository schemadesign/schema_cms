import { expectSaga } from 'redux-saga-test-plan';
import { select } from 'redux-saga/effects';
import Immutable from 'seamless-immutable';
import { OK } from 'http-status-codes';
import nock from 'nock';

import mockApi from '../../../shared/utils/mockApi';
import { DATA_SOURCE_PATH, DATA_SOURCES_PATH, DATA_WRANGLING_SCRIPTS_PATH } from '../../../shared/utils/api.constants';
import { watchDataWranglingScripts } from '../dataWranglingScripts.sagas';
import { DataWranglingScriptsRoutines } from '../dataWranglingScripts.redux';
import { selectDataSource } from '../../dataSource';

describe('DataWranglingScripts: sagas', () => {
  const defaultState = Immutable({});

  beforeEach(() => {
    nock.cleanAll();
  });

  describe('fetchList', () => {
    it('should dispatch a success action', async () => {
      const responseData = ['data 1', 'data 2'];
      const payload = { dataSourceId: 1 };

      mockApi.get(`${DATA_SOURCES_PATH}/${payload.dataSourceId}${DATA_WRANGLING_SCRIPTS_PATH}`).reply(OK, responseData);

      await expectSaga(watchDataWranglingScripts)
        .withState(defaultState)
        .put(DataWranglingScriptsRoutines.fetchList.success(responseData))
        .dispatch(DataWranglingScriptsRoutines.fetchList(payload))
        .silentRun();
    });
  });

  describe('sendList', () => {
    it('should dispatch a success action', async () => {
      const payload = { dataSourceId: '1', steps: ['data 1', 'data 2'] };
      const selectedProject = { id: 1, project: 1 };

      mockApi.put(`${DATA_SOURCE_PATH}/${payload.dataSourceId}/job`, { steps: payload.steps }).reply(OK);

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
      const responseData = ['data 1', 'data 2', 'data 3'];

      mockApi
        .post(`${DATA_SOURCE_PATH}/${payload.dataSourceId}/script-upload`, /form-data; name="script"[^]*file/m, options)
        .reply(OK);
      mockApi.get(`${DATA_SOURCE_PATH}/${payload.dataSourceId}/script`).reply(OK, responseData);

      await expectSaga(watchDataWranglingScripts)
        .withState(defaultState)
        .put(DataWranglingScriptsRoutines.uploadScript.success())
        .dispatch(DataWranglingScriptsRoutines.uploadScript(payload))
        .silentRun();
    });
  });

  // describe('fetchOne', () => {
  //   it('should dispatch a success action', async () => {
  //     const payload = { scriptId: '1' };
  //     const responseData = {
  //       description: 'file description',
  //       code: 'df.columns = map(str.lower, df.columns)',
  //     };
  //
  //     // mockApi.get(`/script/view/${payload.scriptId}`).reply(OK, responseData);
  //
  //     await expectSaga(watchDataWranglingScripts)
  //       .withState(defaultState)
  //       .put(DataWranglingScriptsRoutines.fetchOne.success(responseData))
  //       .dispatch(DataWranglingScriptsRoutines.fetchOne(payload))
  //       .silentRun();
  //   });
  // });
});
