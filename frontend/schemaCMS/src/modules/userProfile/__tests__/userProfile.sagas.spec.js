import { expectSaga } from 'redux-saga-test-plan';
import Immutable from 'seamless-immutable';
import { OK, BAD_REQUEST } from 'http-status-codes';

import mockApi from '../../../shared/utils/mockApi';

import { watchUserProfile } from '../userProfile.sagas';
import { UserProfileActions, UserProfileRoutines } from '../userProfile.redux';
import { ME_PATH } from '../../../shared/utils/api.constants';

describe('UserProfile: sagas', () => {
  const defaultState = Immutable({});
  const data = {
    pk: 1,
  };

  describe('when UserProfileRoutines.fetchUserDetails is fired', () => {
    it('it should put UserProfileActions.fetchUserDetailsSuccess action', async () => {
      mockApi.get(ME_PATH).reply(OK, data);

      await expectSaga(watchUserProfile)
        .withState(defaultState)
        .put(UserProfileActions.fetchUserDetailsSuccess(data))
        .dispatch(UserProfileRoutines.fetchUserDetails())
        .run();
    });

    it('it should put UserProfileActions.fetchUserDetailsError action', async () => {
      mockApi.get(ME_PATH).reply(BAD_REQUEST);

      await expectSaga(watchUserProfile)
        .withState(defaultState)
        .put(UserProfileActions.fetchUserDetailsError())
        .dispatch(UserProfileRoutines.fetchUserDetails())
        .run();
    });
  });
});
