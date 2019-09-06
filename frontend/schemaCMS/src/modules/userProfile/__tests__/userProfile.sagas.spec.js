import { expectSaga } from 'redux-saga-test-plan';
import Immutable from 'seamless-immutable';
import { OK, BAD_REQUEST } from 'http-status-codes';

import mockApi from '../../../shared/utils/mockApi';

import { watchUserProfile } from '../userProfile.sagas';
import { UserProfileActions, UserProfileRoutines } from '../userProfile.redux';
import { ME_PATH } from '../../../shared/utils/api.constants';
import { FIRST_NAME, LAST_NAME } from '../userProfile.constants';

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

  describe('when UserProfileRoutines.updateMe is fired', () => {
    it('it should put UserProfileActions.updateMeSuccess action', async () => {
      mockApi.patch(ME_PATH).reply(OK, data);
      const payload = {
        [FIRST_NAME]: 'Joe',
        [LAST_NAME]: 'Doe',
      };

      await expectSaga(watchUserProfile)
        .withState(defaultState)
        .put(UserProfileActions.updateMeSuccess(data))
        .dispatch(UserProfileRoutines.updateMe({ payload }))
        .run();
    });

    it('it should put UserProfileActions.fetchUserDetailsError action', async () => {
      mockApi.patch(ME_PATH).reply(BAD_REQUEST);
      const payload = {
        [FIRST_NAME]: 'Joe',
        [LAST_NAME]: 'Doe',
      };

      await expectSaga(watchUserProfile)
        .withState(defaultState)
        .put(UserProfileActions.updateMeError())
        .dispatch(UserProfileRoutines.updateMe({ payload }))
        .run();
    });
  });
});
