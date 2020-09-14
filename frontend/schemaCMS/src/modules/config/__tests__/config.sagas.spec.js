import { expectSaga } from 'redux-saga-test-plan';
import Immutable from 'seamless-immutable';

import { watchConfig } from '../config.sagas';
import { ConfigRoutines } from '../config.redux';

describe('Config: sagas', () => {
  const defaultState = Immutable({});

  it('should implement a test', async () => {
    await expectSaga(watchConfig)
      .withState(defaultState)
      .put(ConfigRoutines.noop.success())
      .dispatch(ConfigRoutines.noop())
      .silentRun();
  });
});
