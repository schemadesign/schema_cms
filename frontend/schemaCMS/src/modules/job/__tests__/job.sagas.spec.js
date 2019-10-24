import { expectSaga } from 'redux-saga-test-plan';
import Immutable from 'seamless-immutable';

import { watchJob } from '../job.sagas';
import { JobActions, JobTypes } from '../job.redux';

describe('Job: sagas', () => {
  const defaultState = Immutable({});

  it('should implement a test', async () => {
    await expectSaga(watchStartup)
      .withState(defaultState)
      .put(JobActions.noop())
      .dispatch(StartupActions.startup())
      .silentRun();

    expect(sagaTester.getCalledActions()).to.deep.equal([JobActions.noop()]);
  });
});
