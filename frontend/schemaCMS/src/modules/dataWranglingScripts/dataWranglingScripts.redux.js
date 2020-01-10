import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';
import {
  always,
  ascend,
  cond,
  defaultTo,
  differenceWith,
  equals,
  find,
  ifElse,
  isEmpty,
  lensProp,
  map,
  mergeRight,
  pathOr,
  pipe,
  prop,
  propEq,
  set,
  sortWith,
  T,
} from 'ramda';

import { SCRIPT_TYPES } from './dataWranglingScripts.constants';

const { CUSTOM, DEFAULT, UPLOADED } = SCRIPT_TYPES;

const prefix = 'DATA_WRANGLING_SCRIPTS/';

export const DataWranglingScriptsRoutines = {
  fetchOne: createRoutine(`${prefix}FETCH_ONE`),
  fetchList: createRoutine(`${prefix}FETCH_LIST`),
  sendList: createRoutine(`${prefix}SEND_LIST`),
  setScripts: createRoutine(`${prefix}SET_SCRIPTS`),
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

const addOrderAndChecked = dataSourceScripts => script => {
  const dataSourceScript = defaultTo({}, find(propEq('id', script.id))(dataSourceScripts));

  return ifElse(
    propEq('id', dataSourceScript.id),
    pipe(
      set(lensProp('order'), dataSourceScript.execOrder),
      set(lensProp('checked'), true)
    ),
    set(lensProp('order'), Number.MAX_SAFE_INTEGER)
  )(script);
};

const mergeResults = scripts => script => {
  const foundScript = defaultTo({}, find(propEq('id', script.id), scripts));
  return mergeRight(foundScript, script);
};

const addDifference = stateScripts => scripts => {
  const byId = (x, y) => equals(prop('id', x), prop('id', y));
  const thatsDifferent = differenceWith(byId, scripts, stateScripts);

  return [...thatsDifferent, ...stateScripts];
};

const updateDataWranglingScript = (state = INITIAL_STATE, { payload }) => state.set('script', payload);
const updateDataWranglingScripts = (state = INITIAL_STATE, { payload: { data, dataSource, fromScript } }) => {
  const dataSourceScripts = pathOr([], ['activeJob', 'scripts'], dataSource);
  if (state.scripts.length && fromScript) {
    return state.set(
      'scripts',
      pipe(
        map(mergeResults(data)),
        stateScripts => addDifference(stateScripts)(data),
        map(addScriptType)
      )(state.scripts)
    );
  }

  return state.set(
    'scripts',
    pipe(
      map(addScriptType),
      map(addOrderAndChecked(dataSourceScripts)),
      sortWith([ascend(prop('order')), ascend(prop('type'))])
    )(data)
  );
};

const setImageScrapingFields = (
  state = INITIAL_STATE,
  { payload: { imageScrapingFields, scriptId, imageScriptIndex } }
) =>
  state
    .set('imageScrapingFields', imageScrapingFields)
    .update('customScripts', x => [...x, scriptId])
    .updateIn(['scripts', imageScriptIndex], script => ({ ...script, checked: !isEmpty(imageScrapingFields) }));

const clearCustomScripts = (state = INITIAL_STATE) =>
  state.set('imageScrapingFields', INITIAL_STATE.imageScrapingFields).set('customScripts', INITIAL_STATE.customScripts);

const setScriptsHandler = (state = INITIAL_STATE, { payload }) => state.set('scripts', payload);

export const reducer = createReducer(INITIAL_STATE, {
  [DataWranglingScriptsRoutines.fetchOne.SUCCESS]: updateDataWranglingScript,
  [DataWranglingScriptsRoutines.fetchList.SUCCESS]: updateDataWranglingScripts,
  [DataWranglingScriptsRoutines.setImageScrapingFields.SUCCESS]: setImageScrapingFields,
  [DataWranglingScriptsRoutines.clearCustomScripts.TRIGGER]: clearCustomScripts,
  [DataWranglingScriptsRoutines.setScripts.TRIGGER]: setScriptsHandler,
});
