import { expectSaga } from 'redux-saga-test-plan';
import { OK } from 'http-status-codes';

import mockApi from '../../../shared/utils/mockApi';
import { watchUserAuth } from '../userAuth.sagas';
import { UserAuthActions, INITIAL_STATE } from '../userAuth.redux';
import { TOKEN_PATH } from '../../../shared/utils/api.constants';
import { UserProfileActions, UserProfileRoutines } from '../../userProfile/userProfile.redux';
import { StartupActions } from '../../startup';

describe('UserAuth: sagas', () => {
  const defaultState = INITIAL_STATE;
  const jwtToken = 'aJwtToken';

  beforeEach(() => {
    mockApi.post(TOKEN_PATH).reply(OK, {
      token: jwtToken,
    });

    mockApi.post('/auth/logout/').reply(OK);
  });

  describe('when USER_AUTH/GET_JWT_TOKEN action is fired', () => {
    it('should put USER_AUTH/GET_JWT_TOKEN_SUCCESS with JWT TOKEN', async () => {
      const uid = 'userId';
      const token = '1234';

      await expectSaga(watchUserAuth)
        .withState(defaultState)
        .put(UserAuthActions.getJwtTokenSuccess(jwtToken))
        .dispatch(UserAuthActions.getJwtToken(uid, token))
        .silentRun();
    });

    it('should put fetchUserDetails action', async () => {
      const uid = 'userId';
      const token = '1234';

      await expectSaga(watchUserAuth)
        .withState(defaultState)
        .put(UserProfileRoutines.fetchUserDetails())
        .dispatch(UserAuthActions.getJwtToken(uid, token))
        .silentRun();
    });
  });

  describe('when STARTUP action is fired', () => {
    it('should put UserProfileActions.clearUserDetails action', async () => {
      await expectSaga(watchUserAuth)
        .withState(defaultState)
        .put(UserProfileActions.clearUserDetails())
        .dispatch(StartupActions.startup())
        .silentRun();
    });
  });

  describe('when LOGOUT action is fired', () => {
    it('should put UserAuthActions.logoutSuccess action', async () => {
      await expectSaga(watchUserAuth)
        .withState(defaultState)
        .put(UserAuthActions.logoutSuccess())
        .dispatch(UserAuthActions.logout())
        .silentRun();
    });
  });
});
