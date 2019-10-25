import { expectSaga } from 'redux-saga-test-plan';
import Immutable from 'seamless-immutable';
import { OK } from 'http-status-codes';
import nock from 'nock';

import { JobRoutines } from '../job.redux';
import { watchJob } from '../job.sagas';
import mockApi from '../../../shared/utils/mockApi';

describe('Job: sagas', () => {
  const defaultState = Immutable({});

  beforeEach(() => {
    nock.cleanAll();
  });

  describe('when fetchOne action is called', () => {
    it('should put fetchOne.success action', async () => {
      const response = {
        id: 1,
      };
      const payload = {
        jobId: 1,
      };

      mockApi.get(`/jobs/${payload.jobId}`).reply(OK, response);

      await expectSaga(watchJob)
        .withState(defaultState)
        .put(JobRoutines.fetchOne.success(response))
        .dispatch(JobRoutines.fetchOne(payload))
        .silentRun();
    });
  });

  describe('when updateOne action is called', () => {
    const response = {
      id: 1,
    };
    const payload = {
      pk: 1,
    };

    it('should put updateOne.success action', async () => {
      mockApi.patch('/jobs/1').reply(OK, response);
      await expectSaga(watchJob)
      .withState(defaultState)
      .put(JobRoutines.updateOne.success(response))
      .dispatch(JobRoutines.updateOne(payload))
      .silentRun();
    });
  });

  describe('when fetchPreview action is called', () => {
    it('should put fetchPreview.success action', async () => {
      const response = {
        fields: {},
        data: [],
      };
      const payload = {
        jobId: 1,
      };

      mockApi.get(`/jobs/${payload.jobId}/preview`).reply(OK, response);

      await expectSaga(watchJob)
        .withState(defaultState)
        .put(JobRoutines.fetchPreview.success(response))
        .dispatch(JobRoutines.fetchPreview(payload))
        .silentRun();
    });
  });
});
