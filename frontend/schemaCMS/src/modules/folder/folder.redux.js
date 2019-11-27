import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';

const PREFIX = 'FOLDER/';

export const FolderRoutines = {
  fetchList: createRoutine(`${PREFIX}FETCH_LIST`),
  fetchOne: createRoutine(`${PREFIX}FETCH_ONE`),
  create: createRoutine(`${PREFIX}CREATE`),
  update: createRoutine(`${PREFIX}UPDATE`),
};

export const INITIAL_STATE = new Immutable({
  folders: [],
  folder: {},
});

const setFolders = (state = INITIAL_STATE, { payload }) => state.set('folders', payload);
const setFolder = (state = INITIAL_STATE, { payload }) => state.set('folder', payload);

export const reducer = createReducer(INITIAL_STATE, {
  [FolderRoutines.fetchList.success]: setFolders,
  [FolderRoutines.fetchOne.success]: setFolder,
});
