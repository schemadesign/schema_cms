import { expectSaga } from 'redux-saga-test-plan';
import { select } from 'redux-saga/effects';
import Immutable from 'seamless-immutable';
import { BAD_REQUEST, OK } from 'http-status-codes';

import mockApi from '../../../shared/utils/mockApi';
import { PROJECTS_PATH } from '../../../shared/utils/api.constants';
import { watchUser } from '../user.sagas';
import { UserRoutines } from '../user.redux';
import { PROJECT_DESCRIPTION, PROJECT_OWNER, PROJECT_TITLE } from '../user.constants';
import { selectUserData } from '../../userProfile';
import browserHistory from '../../../shared/utils/history';

describe('User: sagas', () => {
  const defaultState = Immutable({});

  describe('when /CREATE_USER_CMS action is fired', () => {
    it('should put createUserCMS success action', async () => {
      await expectSaga(watchUser)
        .withState(defaultState)
        .put(UserRoutines.createUserCMS.success())
        .dispatch(UserRoutines.createUserCMS())
        .silentRun();
    });
  });
});
