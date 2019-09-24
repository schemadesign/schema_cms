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
  dataWrangling: {},
  dataWranglings: [],
});

const updateDataWrangling = (state = INITIAL_STATE, { payload }) => state.set('dataWrangling', payload);
const updateDataWranglings = (state = INITIAL_STATE, { payload }) => state.set('dataWranglings', payload);
const unmountDataWrangling = (state = INITIAL_STATE) => state.set('dataWrangling', INITIAL_STATE.dataWrangling);

export const reducer = createReducer(INITIAL_STATE, {
  [DataWranglingScriptsRoutines.fetchOne.SUCCESS]: updateDataWrangling,
  [DataWranglingScriptsRoutines.unmountOne.TRIGGER]: unmountDataWrangling,
  [DataWranglingScriptsRoutines.fetchList.SUCCESS]: updateDataWranglings,
});
