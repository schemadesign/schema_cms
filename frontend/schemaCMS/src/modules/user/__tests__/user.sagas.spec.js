import { expectSaga } from 'redux-saga-test-plan';
import Immutable from 'seamless-immutable';
import { BAD_REQUEST, OK } from 'http-status-codes';

import mockApi from '../../../shared/utils/mockApi';
import { watchUser } from '../user.sagas';
import { UserRoutines } from '../user.redux';
import { ROLES } from '../../userProfile/userProfile.constants';
import { PROJECTS_PATH } from '../../../shared/utils/api.constants';

expectSaga.DEFAULT_TIMEOUT = 500;

describe('User: sagas', () => {
  const defaultState = Immutable({});

  describe('when /CREATE_USER_CMS action is fired', () => {
    it('should put createUserCMS success action', async () => {
      mockApi.post('/users').reply(OK);

      const payload = {
        email: 'alan@alanwatts.org',
        role: ROLES.EDITOR,
      };
      await expectSaga(watchUser)
        .withState(defaultState)
        .put(UserRoutines.createUserCMS.success())
        .dispatch(UserRoutines.createUserCMS(payload))
        .silentRun();
    });

    it('should put createUserCMS failure action', async () => {
      mockApi.post('/users').reply(BAD_REQUEST);

      const payload = {};

      await expectSaga(watchUser)
        .withState(defaultState)
        .put(UserRoutines.createUserCMS.failure())
        .dispatch(UserRoutines.createUserCMS({ payload }))
        .silentRun();
    });
  });

  describe('when /CREATE_USER_PROJECT action is fired', () => {
    it('should put createUserProject success action', async () => {
      mockApi.post(`${PROJECTS_PATH}/1`).reply(OK);

      const payload = {
        projectId: 1,
        userId: 2,
      };
      await expectSaga(watchUser)
        .withState(defaultState)
        .put(UserRoutines.createUserProject.success())
        .dispatch(UserRoutines.createUserProject(payload))
        .silentRun();
    });

    it('should put createUserCMS failure action', async () => {
      mockApi.post(`${PROJECTS_PATH}/1`).reply(BAD_REQUEST);

      const payload = {
        projectId: 1,
        userId: 2,
      };
      await expectSaga(watchUser)
        .withState(defaultState)
        .put(UserRoutines.createUserProject.failure())
        .dispatch(UserRoutines.createUserProject(payload))
        .silentRun();
    });
  });
});
