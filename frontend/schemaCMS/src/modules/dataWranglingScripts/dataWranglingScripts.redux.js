import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';
import { IMAGE_SCRAPPING_SCRIPT_TYPE } from './dataWranglingScripts.constants';

const prefix = 'DATA_WRANGLING_SCRIPTS/';

export const DataWranglingScriptsRoutines = {
  fetchOne: createRoutine(`${prefix}FETCH_ONE`),
  fetchList: createRoutine(`${prefix}FETCH_LIST`),
  sendList: createRoutine(`${prefix}SEND_LIST`),
  uploadScript: createRoutine(`${prefix}UPLOAD_SCRIPT`),
};

export const INITIAL_STATE = new Immutable({
  script: {},
  scripts: [],
});

const updateDataWranglingScript = (state = INITIAL_STATE, { payload }) => {
  const parsedPayload = { ...payload, type: payload.name === 'Image Scrapping' ? IMAGE_SCRAPPING_SCRIPT_TYPE : null };
  return state.set('script', parsedPayload);
};
const updateDataWranglingScripts = (state = INITIAL_STATE, { payload }) => state.set('scripts', payload);

export const reducer = createReducer(INITIAL_STATE, {
  [DataWranglingScriptsRoutines.fetchOne.SUCCESS]: updateDataWranglingScript,
  [DataWranglingScriptsRoutines.fetchList.SUCCESS]: updateDataWranglingScripts,
});
