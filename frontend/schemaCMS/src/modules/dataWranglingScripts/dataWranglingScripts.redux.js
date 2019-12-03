import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';

const prefix = 'DATA_WRANGLING_SCRIPTS/';

export const DataWranglingScriptsRoutines = {
  fetchOne: createRoutine(`${prefix}FETCH_ONE`),
  fetchList: createRoutine(`${prefix}FETCH_LIST`),
  sendList: createRoutine(`${prefix}SEND_LIST`),
  uploadScript: createRoutine(`${prefix}UPLOAD_SCRIPT`),
  setImageScrappingFields: createRoutine(`${prefix}SET_IMAGE_SCRAPPING_FIELDS`),
};

export const INITIAL_STATE = new Immutable({
  script: {
    specs: {},
  },
  scripts: [],
  imageScrappingFields: [],
  customScripts: [],
});

const updateDataWranglingScript = (state = INITIAL_STATE, { payload }) => state.set('script', payload);
const updateDataWranglingScripts = (state = INITIAL_STATE, { payload }) => state.set('scripts', payload);

const setImageScrappingFields = (state = INITIAL_STATE, { payload: { imageScrappingFields, scriptId } }) =>
  state.set('imageScrappingFields', imageScrappingFields).update('customScripts', x => [...x, scriptId]);

export const reducer = createReducer(INITIAL_STATE, {
  [DataWranglingScriptsRoutines.fetchOne.SUCCESS]: updateDataWranglingScript,
  [DataWranglingScriptsRoutines.fetchList.SUCCESS]: updateDataWranglingScripts,
  [DataWranglingScriptsRoutines.setImageScrappingFields.SUCCESS]: setImageScrappingFields,
});
