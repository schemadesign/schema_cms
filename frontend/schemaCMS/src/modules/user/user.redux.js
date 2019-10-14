import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';

const PREFIX = 'USER/';

export const UserRoutines = {
  createUserProject: createRoutine(`${PREFIX}CREATE_USER_PROJECT`),
  createUserCMS: createRoutine(`${PREFIX}CREATE_USER_CMS`),
  unmountUser: createRoutine(`${PREFIX}UNMOUNT_USER`),
  fetchUser: createRoutine(`${PREFIX}FETCH_USER`),
};

export const INITIAL_STATE = new Immutable({
  user: {},
});

const unmountUser = (state = INITIAL_STATE) => state.set('user', {});

const fetchUser = (state = INITIAL_STATE, { payload }) => state.set('user', payload);

export const reducer = createReducer(INITIAL_STATE, {
  [UserRoutines.unmountUser.TRIGGER]: unmountUser,
  [UserRoutines.fetchUser.SUCCESS]: fetchUser,
});
