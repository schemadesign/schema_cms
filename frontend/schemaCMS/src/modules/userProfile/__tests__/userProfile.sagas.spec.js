import { expectSaga } from 'redux-saga-test-plan';
import Immutable from 'seamless-immutable';
import { OK, BAD_REQUEST } from 'http-status-codes';

import mockApi from '../../../shared/utils/mockApi';

import { watchUserProfile } from '../userProfile.sagas';
import { UserProfileRoutines } from '../userProfile.redux';
import { ME_PATH } from '../../../shared/utils/api.constants';
import { FIRST_NAME, LAST_NAME } from '../userProfile.constants';

describe('UserProfile: sagas', () => {
  const defaultState = Immutable({});
  const data = {
    pk: 1,
  };

  describe('when UserProfileRoutines.fetchUserDetails is fired', () => {
    it('it should put fetchUserDetails.success action', async () => {
      mockApi.get(ME_PATH).reply(OK, data);

      await expectSaga(watchUserProfile)
        .withState(defaultState)
        .put(UserProfileRoutines.fetchUserDetails.success(data))
        .dispatch(UserProfileRoutines.fetchUserDetails())
        .silentRun();
    });

    it('it should put fetchUserDetails.failure action', async () => {
      mockApi.get(ME_PATH).reply(BAD_REQUEST);

      await expectSaga(watchUserProfile)
        .withState(defaultState)
        .put(UserProfileRoutines.fetchUserDetails.failure())
        .dispatch(UserProfileRoutines.fetchUserDetails())
        .silentRun();
    });
  });

  describe('when UserProfileRoutines.updateMe is fired', () => {
    it('it should put updateMe.success action', async () => {
      mockApi.patch(ME_PATH).reply(OK, data);
      const payload = {
        [FIRST_NAME]: 'Joe',
        [LAST_NAME]: 'Doe',
      };

      await expectSaga(watchUserProfile)
        .withState(defaultState)
        .put(UserProfileRoutines.updateMe.success(data))
        .dispatch(UserProfileRoutines.updateMe({ payload }))
        .silentRun();
    });

    it('it should put updateMe.failure action', async () => {
      mockApi.patch(ME_PATH).reply(BAD_REQUEST);
      const payload = {
        [FIRST_NAME]: 'Joe',
        [LAST_NAME]: 'Doe',
      };

      await expectSaga(watchUserProfile)
        .withState(defaultState)
        .put(UserProfileRoutines.updateMe.failure())
        .dispatch(UserProfileRoutines.updateMe({ payload }))
        .silentRun();
    });
  });
});
