import { expectSaga } from 'redux-saga-test-plan';
import Immutable from 'seamless-immutable';
import { BAD_REQUEST, OK } from 'http-status-codes';

import mockApi from '../../../shared/utils/mockApi';
import { watchUser } from '../user.sagas';
import { UserRoutines } from '../user.redux';
import { ROLES } from '../../userProfile/userProfile.constants';
import { PROJECTS_PATH } from '../../../shared/utils/api.constants';
import { ProjectRoutines } from '../../project';

expectSaga.DEFAULT_TIMEOUT = 500;

describe('User: sagas', () => {
  const defaultState = Immutable({});
  const errorResponseData = { name: [{ code: 'code', message: 'message' }] };
  const errorResult = [{ code: 'code', name: 'name' }];

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
      mockApi.post('/users').reply(BAD_REQUEST, errorResponseData);

      const payload = {};

      await expectSaga(watchUser)
        .withState(defaultState)
        .put(UserRoutines.createUserCMS.failure(errorResult))
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

    it('should put createUserProject failure action', async () => {
      mockApi.post(`${PROJECTS_PATH}/1`).reply(BAD_REQUEST, errorResponseData);

      const payload = {
        projectId: 1,
        userId: 2,
      };
      await expectSaga(watchUser)
        .withState(defaultState)
        .put(UserRoutines.createUserProject.failure(errorResult))
        .dispatch(UserRoutines.createUserProject(payload))
        .silentRun();
    });
  });

  describe('when /REMOVE_USER action is fired', () => {
    it('should put removeUser success action', async () => {
      const payload = {
        userId: 2,
      };
      mockApi.post(`/users/${payload.userId}/deactivate`).reply(OK);

      await expectSaga(watchUser)
        .withState(defaultState)
        .put(UserRoutines.removeUser.success())
        .dispatch(UserRoutines.removeUser(payload))
        .silentRun();
    });

    it('should put removeUser failure action', async () => {
      const payload = {
        userId: 2,
      };
      mockApi.post(`/users/${payload.userId}/deactivate`).reply(BAD_REQUEST);

      await expectSaga(watchUser)
        .withState(defaultState)
        .put(UserRoutines.removeUser.failure())
        .dispatch(UserRoutines.removeUser(payload))
        .silentRun();
    });
  });

  describe('when /MAKE_ADMIN action is fired', () => {
    it('should put makeAdmin success action', async () => {
      const payload = {
        userId: 2,
      };
      const responseData = { id: 'id' };
      mockApi.put(`/users/${payload.userId}`, { role: ROLES.ADMIN }).reply(OK, responseData);

      await expectSaga(watchUser)
        .withState(defaultState)
        .put(UserRoutines.makeAdmin.success(responseData))
        .dispatch(UserRoutines.makeAdmin(payload))
        .silentRun();
    });

    it('should put makeAdmin failure action', async () => {
      const payload = {
        userId: 2,
      };
      mockApi.put(`/users/${payload.userId}`, { role: ROLES.ADMIN }).reply(BAD_REQUEST);

      await expectSaga(watchUser)
        .withState(defaultState)
        .put(UserRoutines.makeAdmin.failure())
        .dispatch(UserRoutines.makeAdmin(payload))
        .silentRun();
    });
  });

  describe('when /FETCH_USERS action is fired', () => {
    it('should put fetchUsers success action', async () => {
      const responseData = { results: [] };
      mockApi.get('/users?page_size=1000').reply(OK, responseData);

      await expectSaga(watchUser)
        .withState(defaultState)
        .put(ProjectRoutines.clearProject.trigger())
        .put(UserRoutines.fetchUsers.success(responseData.results))
        .dispatch(UserRoutines.fetchUsers())
        .silentRun();
    });
  });

  it('should put clearProject trigger action', async () => {
    const responseData = { results: [] };
    const payload = { projectId: '1' };
    mockApi.get('/users?page_size=1000').reply(OK, responseData);

    await expectSaga(watchUser)
      .withState(defaultState)
      .put(UserRoutines.fetchUsers.success(responseData.results))
      .dispatch(UserRoutines.fetchUsers(payload))
      .silentRun();
  });
});
