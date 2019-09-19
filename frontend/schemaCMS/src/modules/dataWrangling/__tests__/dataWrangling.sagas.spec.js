import { expectSaga } from 'redux-saga-test-plan';
import Immutable from 'seamless-immutable';
import { OK } from 'http-status-codes';

import mockApi from '../../../shared/utils/mockApi';
import { DATA_SOURCE_PATH } from '../../../shared/utils/api.constants';
import { watchDataWrangling } from '../dataWrangling.sagas';
import { DataWranglingRoutines } from '../dataWrangling.redux';

describe('DataWrangling: sagas', () => {
  const defaultState = Immutable({});

  beforeEach(() => {
    nock.cleanAll();
  });

  describe('fetchList', () => {
    it('should dispatch a success action', async () => {
      const payload = { dataSourceId: '1' };
      const responseData = ['data 1', 'data 2'];

      mockApi.get(`${DATA_SOURCE_PATH}/${payload.dataSourceId}/script`).reply(OK, responseData);

      await expectSaga(watchDataWrangling)
        .withState(defaultState)
        .put(DataWranglingRoutines.fetchList.success(responseData))
        .dispatch(DataWranglingRoutines.fetchList(payload))
        .silentRun();
    });
  });

  describe('sendList', () => {
    it('should dispatch a success action', async () => {
      const payload = { dataSourceId: '1', list: ['data 1', 'data 2'] };

      mockApi.put(`${DATA_SOURCE_PATH}/${payload.dataSourceId}/script`, { list: payload.list }).reply(OK);

      await expectSaga(watchDataWrangling)
        .withState(defaultState)
        .put(DataWranglingRoutines.sendList.success())
        .dispatch(DataWranglingRoutines.sendList(payload))
        .silentRun();
    });
  });

  describe('uploadScript', () => {
    it('should dispatch a success action', async () => {
      const options = {
        headers: { 'Content-Type': 'multipart/form-data' },
      };
      const payload = { dataSourceId: '1', file: new File(['foo'], 'foo.py', { type: 'text/plain' }) };
      const responseData = ['data 1', 'data 2', 'data 3'];

      mockApi
        .put(`${DATA_SOURCE_PATH}/${payload.dataSourceId}/script`, /form-data; name="file"[^]*file/m, options)
        .reply(OK);
      mockApi.get(`${DATA_SOURCE_PATH}/${payload.dataSourceId}/script`).reply(OK, responseData);

      await expectSaga(watchDataWrangling)
        .withState(defaultState)
        .put(DataWranglingRoutines.uploadScript.success())
        .dispatch(DataWranglingRoutines.uploadScript(payload))
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

      mockApi.get(`/script/view/${payload.scriptId}`).reply(OK, responseData);

      await expectSaga(watchDataWrangling)
      .withState(defaultState)
      .put(DataWranglingRoutines.fetchOne.success(responseData))
      .dispatch(DataWranglingRoutines.fetchOne(payload))
      .silentRun();
    });
  });
});
