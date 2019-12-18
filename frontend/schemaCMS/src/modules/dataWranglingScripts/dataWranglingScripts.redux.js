import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';
import {
  always,
  cond,
  isEmpty,
  lensProp,
  map,
  pipe,
  propEq,
  pathOr,
  T,
  set,
  prop,
  sortWith,
  ifElse,
  ascend,
  find,
  defaultTo,
} from 'ramda';

import { SCRIPT_TYPES } from './dataWranglingScripts.constants';

const { CUSTOM, DEFAULT, UPLOADED } = SCRIPT_TYPES;

const prefix = 'DATA_WRANGLING_SCRIPTS/';

export const DataWranglingScriptsRoutines = {
  fetchOne: createRoutine(`${prefix}FETCH_ONE`),
  fetchList: createRoutine(`${prefix}FETCH_LIST`),
  sendList: createRoutine(`${prefix}SEND_LIST`),
  uploadScript: createRoutine(`${prefix}UPLOAD_SCRIPT`),
  setImageScrapingFields: createRoutine(`${prefix}SET_IMAGE_SCRAPING_FIELDS`),
  clearCustomScripts: createRoutine(`${prefix}CLEAR_CUSTOM_SCRIPTS`),
};

export const INITIAL_STATE = new Immutable({
  script: {
    specs: {},
  },
  scripts: [],
  imageScrapingFields: [],
  customScripts: [],
});

const addScriptType = script =>
  set(
    lensProp('type'),
    cond([
      [propEq('isPredefined', false), always(UPLOADED)],
      [({ specs }) => !isEmpty(specs), always(CUSTOM)],
      [T, always(DEFAULT)],
    ])(script)
  )(script);

const addOrder = dataSourceScripts => script => {
  const dataSourceScript = defaultTo({}, find(propEq('id', script.id))(dataSourceScripts));

  return ifElse(
    propEq('id', dataSourceScript.id),
    set(lensProp('order'), dataSourceScript.execOrder),
    set(lensProp('order'), Number.MAX_SAFE_INTEGER)
  )(script);
};

const updateDataWranglingScript = (state = INITIAL_STATE, { payload }) => state.set('script', payload);
const updateDataWranglingScripts = (state = INITIAL_STATE, { payload: { data, dataSource } }) =>
  state.set(
    'scripts',
    pipe(
      map(addScriptType),
      map(addOrder(pathOr([], ['activeJob', 'scripts'], dataSource))),
      sortWith([ascend(prop('order')), ascend(prop('type'))])
    )(data)
  );

const setImageScrapingFields = (state = INITIAL_STATE, { payload: { imageScrapingFields, scriptId } }) =>
  state.set('imageScrapingFields', imageScrapingFields).update('customScripts', x => [...x, scriptId]);

const clearCustomScripts = (state = INITIAL_STATE) =>
  state.set('imageScrapingFields', INITIAL_STATE.imageScrapingFields).set('customScripts', INITIAL_STATE.customScripts);

export const reducer = createReducer(INITIAL_STATE, {
  [DataWranglingScriptsRoutines.fetchOne.SUCCESS]: updateDataWranglingScript,
  [DataWranglingScriptsRoutines.fetchList.SUCCESS]: updateDataWranglingScripts,
  [DataWranglingScriptsRoutines.setImageScrapingFields.SUCCESS]: setImageScrapingFields,
  [DataWranglingScriptsRoutines.clearCustomScripts.TRIGGER]: clearCustomScripts,
});
