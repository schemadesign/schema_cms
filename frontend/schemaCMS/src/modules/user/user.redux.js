import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';

const PREFIX = 'USER/';

export const UserRoutines = {
  createUserProject: createRoutine(`${PREFIX}CREATE_USER_PROJECT`),
  createUserCMS: createRoutine(`${PREFIX}CREATE_USER_CMS`),
};

export const INITIAL_STATE = new Immutable({});

export const reducer = createReducer(INITIAL_STATE, {});
