import { expectSaga } from 'redux-saga-test-plan';
import Immutable from 'seamless-immutable';

import { watchAppConfig } from '../appConfig.sagas';
import { AppConfigActions, AppConfigTypes } from '../appConfig.redux';

describe('AppConfig: sagas', () => {
  const defaultState = Immutable({});

  it('should implement a test', async () => {
    await expectSaga(watchStartup)
      .withState(defaultState)
      .put(AppConfigActions.noop())
      .dispatch(StartupActions.startup())
      .run();

    expect(sagaTester.getCalledActions()).to.deep.equal([AppConfigActions.noop()]);
  });
});
