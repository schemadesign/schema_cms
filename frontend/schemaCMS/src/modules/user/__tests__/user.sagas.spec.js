import { expectSaga } from 'redux-saga-test-plan';
import Immutable from 'seamless-immutable';

import { watchUser } from '../user.sagas';
import { UserActions, UserTypes } from '../user.redux';

describe('User: sagas', () => {
  const defaultState = Immutable({});

  it('should implement a test', async () => {
    await expectSaga(watchStartup)
      .withState(defaultState)
      .put(UserActions.noop())
      .dispatch(StartupActions.startup())
      .silentRun();

    expect(sagaTester.getCalledActions()).to.deep.equal([UserActions.noop()]);
  });
});
