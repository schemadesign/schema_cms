import { expectSaga } from 'redux-saga-test-plan';
import Immutable from 'seamless-immutable';
import { OK } from 'http-status-codes';

import { JobRoutines } from '../job.redux';
import { watchJob } from '../job.sagas';
import mockApi from '../../../shared/utils/mockApi';

describe('Job: sagas', () => {
  const defaultState = Immutable({});
  const response = {
    id: 1,
  };

  describe('when fetchOne action is called', () => {
    const payload = {
      jobId: 1,
    };

    it('should put fetchOne.success action', async () => {
      mockApi.get('/jobs/1').reply(OK, response);
      await expectSaga(watchJob)
        .withState(defaultState)
        .put(JobRoutines.fetchOne.success(response))
        .dispatch(JobRoutines.fetchOne(payload))
        .silentRun();
    });
  });

  describe('when updateOne action is called', () => {
    const payload = {
      jobId: 1,
    };

    it('should put updateOne.success action', async () => {
      mockApi.patch('/jobs/1').reply(OK);
      mockApi.get('/jobs/1').reply(OK, response);
      await expectSaga(watchJob)
        .withState(defaultState)
        .put(JobRoutines.updateOne.success())
        .dispatch(JobRoutines.updateOne(payload))
        .silentRun();
    });
  });
});
