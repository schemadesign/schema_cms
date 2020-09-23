import { expectSaga } from 'redux-saga-test-plan';
import Immutable from 'seamless-immutable';
import { OK } from 'http-status-codes';

import { watchConfig } from '../config.sagas';
import { ConfigRoutines } from '../config.redux';
import mockApi from '../../../shared/utils/mockApi';
import { OKTA_BACKEND } from '../config.constants';

describe('Config: sagas', () => {
  const defaultState = Immutable({});

  it('should fetch config', async () => {
    const response = {
      authenticationBackend: OKTA_BACKEND,
    };

    mockApi.get('/config').reply(OK, response);

    await expectSaga(watchConfig)
      .withState(defaultState)
      .put(ConfigRoutines.fetchConfig.request())
      .put(ConfigRoutines.fetchConfig.success(response))
      .dispatch(ConfigRoutines.fetchConfig())
      .silentRun();
  });
});
