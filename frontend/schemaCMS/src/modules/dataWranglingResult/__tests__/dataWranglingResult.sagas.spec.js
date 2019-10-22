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

  describe('fetch', () => {
    it('should dispatch a success action', async () => {
      const payload = { jobId: '1' };
      const responseData = {
        fields: {
          id: {},
          name: {},
        },
        // eslint-disable-next-line camelcase
        preview_table: [{ id: '1', name: 'test' }],
      };

      mockApi
        .persist()
        .get(`/jobs/${payload.jobId}/result-preview`)
        .reply(OK, responseData);

      await expectSaga(watchDataWranglingResult)
        .withState(defaultState)
        .put(DataWranglingResultRoutines.fetch.success(responseData))
        .dispatch(DataWranglingResultRoutines.fetch(payload))
        .silentRun();
    });
  });
});
