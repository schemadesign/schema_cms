import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';

const PREFIX = 'USER/';

export const UserRoutines = {
  createUserProject: createRoutine(`${PREFIX}CREATE_USER_PROJECT`),
  createUserCMS: createRoutine(`${PREFIX}CREATE_USER_CMS`),
  unmountUser: createRoutine(`${PREFIX}UNMOUNT_USER`),
  fetchUser: createRoutine(`${PREFIX}FETCH_USER`),
  makeAdmin: createRoutine(`${PREFIX}MAKE_ADMIN`),
  fetchUsers: createRoutine(`${PREFIX}FETCH_USERS`),
  removeUser: createRoutine(`${PREFIX}REMOVE_USERS`),
};

export const INITIAL_STATE = new Immutable({
  user: {},
  users: [],
});

const unmountUser = (state = INITIAL_STATE) => state.set('user', {});

const updateUser = (state = INITIAL_STATE, { payload }) => state.set('user', payload);

const updateUsers = (state = INITIAL_STATE, { payload }) => state.set('users', payload);

export const reducer = createReducer(INITIAL_STATE, {
  [UserRoutines.unmountUser.TRIGGER]: unmountUser,
  [UserRoutines.fetchUser.SUCCESS]: updateUser,
  [UserRoutines.makeAdmin.SUCCESS]: updateUser,
  [UserRoutines.fetchUsers.SUCCESS]: updateUsers,
  [UserRoutines.removeUser.SUCCESS]: unmountUser,
});
