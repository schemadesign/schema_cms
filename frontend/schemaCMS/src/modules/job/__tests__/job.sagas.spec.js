import { expectSaga } from 'redux-saga-test-plan';
import Immutable from 'seamless-immutable';
import { OK } from 'http-status-codes';

import { JobRoutines } from '../job.redux';
import { watchJob } from '../job.sagas';
import mockApi from '../../../shared/utils/mockApi';

describe('Job: sagas', () => {
  const defaultState = Immutable({});

  describe('when fetchOne action is called', () => {
    const response = {
      id: 1,
    };

    mockApi.get('/jobs/1').reply(OK, response);
    const payload = {
      jobId: 1,
    };

    it('should put fetchOne.success action', async () => {
      await expectSaga(watchJob)
        .withState(defaultState)
        .put(JobRoutines.fetchOne.success(response))
        .dispatch(JobRoutines.fetchOne(payload))
        .silentRun();
    });
  });
});
