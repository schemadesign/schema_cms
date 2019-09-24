import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';

const prefix = 'DATA_WRANGLING_SCRIPTS/';

export const DataWranglingScriptsRoutines = {
  fetchOne: createRoutine(`${prefix}FETCH_ONE`),
  unmountOne: createRoutine(`${prefix}UNMOUNT_ONE`),
  fetchList: createRoutine(`${prefix}FETCH_LIST`),
  sendList: createRoutine(`${prefix}SEND_LIST`),
  uploadScript: createRoutine(`${prefix}UPLOAD_SCRIPT`),
};

export const INITIAL_STATE = new Immutable({
  dataWranglingScript: {},
  dataWranglingScripts: [],
});

const updateDataWranglingScript = (state = INITIAL_STATE, { payload }) => state.set('dataWranglingScript', payload);
const updateDataWranglingScripts = (state = INITIAL_STATE, { payload }) => state.set('dataWranglingScripts', payload);
const unmountDataWranglingScript = (state = INITIAL_STATE) =>
  state.set('dataWranglingScript', INITIAL_STATE.dataWranglingScript);

export const reducer = createReducer(INITIAL_STATE, {
  [DataWranglingScriptsRoutines.fetchOne.SUCCESS]: updateDataWranglingScript,
  [DataWranglingScriptsRoutines.unmountOne.TRIGGER]: unmountDataWranglingScript,
  [DataWranglingScriptsRoutines.fetchList.SUCCESS]: updateDataWranglingScripts,
});
