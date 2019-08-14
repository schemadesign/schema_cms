import { expectSaga } from 'redux-saga-test-plan';
import Immutable from 'seamless-immutable';

import { watchUserAuth } from '../userAuth.sagas';
import { UserAuthActions, UserAuthTypes, INITIAL_STATE } from '../userAuth.redux';

describe('UserAuth: sagas', () => {
  const defaultState = INITIAL_STATE;

  it('should implement a test', async () => {
    await expectSaga(watchStartup)
      .withState(defaultState)
      .put(UserAuthActions.noop())
      .dispatch(StartupActions.startup())
      .run();

    expect(sagaTester.getCalledActions()).to.deep.equal([UserAuthActions.noop()]);
  });
});
