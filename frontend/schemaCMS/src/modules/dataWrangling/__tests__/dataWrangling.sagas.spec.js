import Immutable from 'seamless-immutable';
import { expectSaga } from 'redux-saga-test-plan';
import { OK } from 'http-status-codes';
import nock from 'nock';

import { watchDataWrangling } from '../dataWrangling.sagas';
import { DataWranglingRoutines } from '../dataWrangling.redux';
import mockApi from '../../../shared/utils/mockApi';

describe('DataWrangling: sagas', () => {
  const defaultState = Immutable({});

  beforeEach(() => {
    nock.cleanAll();
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
