import { expectSaga } from 'redux-saga-test-plan';
import Immutable from 'seamless-immutable';
import { OK } from 'http-status-codes';
import nock from 'nock';

import mockApi from '../../../shared/utils/mockApi';
import { watchDataWranglingResult } from '../dataWranglingResult.sagas';
import { DataWranglingResultRoutines } from '../dataWranglingResult.redux';

describe('DataWranglingResult: sagas', () => {
  const defaultState = Immutable({});

  beforeEach(() => {
    nock.cleanAll();
  });

  describe('fetchFields', () => {
    it('should dispatch a success action', async () => {
      const payload = { dataSourceId: '1' };
      const responseData = {
        fields: {
          id: {},
          name: {},
        },
        previewTable: [{ id: '1', name: 'test' }],
      };

      mockApi.get(`data-wrangling-result/${payload.dataSourceId}`).reply(OK, responseData);

      await expectSaga(watchDataWranglingResult)
        .withState(defaultState)
        .put(DataWranglingResultRoutines.fetch.success(responseData))
        .dispatch(DataWranglingResultRoutines.fetch(payload))
        .silentRun();
    });
  });
});
