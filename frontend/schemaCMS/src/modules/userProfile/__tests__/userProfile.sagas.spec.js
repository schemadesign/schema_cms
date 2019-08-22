import { expectSaga } from 'redux-saga-test-plan';
import Immutable from 'seamless-immutable';

import { watchUserProfile } from '../userProfile.sagas';
import { UserProfileActions, UserProfileTypes } from '../userProfile.redux';

describe('UserProfile: sagas', () => {
  const defaultState = Immutable({});

  it('should implement a test', async () => {
    await expectSaga(watchStartup)
      .withState(defaultState)
      .put(UserProfileActions.noop())
      .dispatch(StartupActions.startup())
      .run();

    expect(sagaTester.getCalledActions()).to.deep.equal([UserProfileActions.noop()]);
  });
});
