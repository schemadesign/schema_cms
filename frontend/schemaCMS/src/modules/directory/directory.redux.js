import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';

const PREFIX = 'DIRECTORY/';

export const DirectoryRoutines = {
  fetchList: createRoutine(`${PREFIX}FETCH_LIST`),
  create: createRoutine(`${PREFIX}CREATE`),
};

export const INITIAL_STATE = new Immutable({
  directories: [],
  directory: {},
});

const setDirectories = (state = INITIAL_STATE, { payload }) => state.set('directories', payload);

const setDirectory = (state = INITIAL_STATE, { payload }) => state.set('directory', payload);

export const reducer = createReducer(INITIAL_STATE, {
  [DirectoryRoutines.fetchList.success]: setDirectories,
  [DirectoryRoutines.create.success]: setDirectory,
});
