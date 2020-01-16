import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';
import {
  always,
  cond,
  differenceWith,
  groupBy,
  ifElse,
  includes,
  isEmpty,
  lensProp,
  map,
  pathOr,
  pipe,
  prop,
  propEq,
  set,
  sortBy,
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
  setCheckedScripts: createRoutine(`${prefix}SET_CHECKED_SCRIPTS`),
  uploadScript: createRoutine(`${prefix}UPLOAD_SCRIPT`),
  setImageScrapingFields: createRoutine(`${prefix}SET_IMAGE_SCRAPING_FIELDS`),
  clearCustomScripts: createRoutine(`${prefix}CLEAR_CUSTOM_SCRIPTS`),
};

export const INITIAL_STATE = new Immutable({
  script: {
    specs: {},
  },
  scripts: [],
  checkedScripts: [],
  uncheckedScripts: [],
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

const updateScripts = ifElse(
  propEq('checked', true),
  ({ checkedScripts, uncheckedScripts, script }) => ({
    checkedScripts: checkedScripts.concat(script),
    uncheckedScripts: uncheckedScripts.filter(({ id }) => id !== script.id),
  }),
  ({ checkedScripts, uncheckedScripts, script }) => ({
    checkedScripts: checkedScripts.filter(({ id }) => id !== script.id),
    uncheckedScripts: [script].concat(uncheckedScripts),
  })
);

const updateDataWranglingScript = (state = INITIAL_STATE, { payload }) => state.set('script', payload);
const updateDataWranglingScripts = (
  state = INITIAL_STATE,
  { payload: { data, dataSource, fromScript, uploadScript } }
) => {
  if (fromScript) {
    return state;
  }

  if (uploadScript) {
    const scripts = differenceWith((x, y) => x.id === y.id, data, state.scripts);

    return state.set('scripts', data).update('checkedScripts', list => list.concat(scripts));
  }

  const dataSourceScripts = pipe(
    pathOr([], ['activeJob', 'scripts']),
    map(prop('id'))
  )(dataSource);

  const { unchecked = [], checked = [] } = pipe(
    map(addScriptType),
    sortBy(prop('type')),
    groupBy(ifElse(({ id }) => includes(id)(dataSourceScripts), always('checked'), always('unchecked')))
  )(data);

  return state
    .set('scripts', data)
    .set('uncheckedScripts', unchecked)
    .set('checkedScripts', checked);
};

const setImageScrapingFields = (state = INITIAL_STATE, { payload: { imageScrapingFields, scriptId } }) => {
  const script = state.scripts.find(({ id }) => id.toString() === scriptId);
  const { uncheckedScripts, checkedScripts } = updateScripts({
    ...state,
    script,
    checked: !isEmpty(imageScrapingFields),
  });

  return state
    .set('imageScrapingFields', imageScrapingFields)
    .update('customScripts', x => [...x, scriptId])
    .set('uncheckedScripts', uncheckedScripts)
    .set('checkedScripts', checkedScripts);
};

const clearCustomScripts = (state = INITIAL_STATE) =>
  state.set('imageScrapingFields', INITIAL_STATE.imageScrapingFields).set('customScripts', INITIAL_STATE.customScripts);

const setScriptsHandler = (state = INITIAL_STATE, { payload: { script, checked } }) => {
  const { uncheckedScripts, checkedScripts } = updateScripts({ ...state, script, checked });

  return state.set('uncheckedScripts', uncheckedScripts).set('checkedScripts', checkedScripts);
};

const setCheckedScriptsHandler = (state = INITIAL_STATE, { payload }) => state.set('checkedScripts', payload);

export const reducer = createReducer(INITIAL_STATE, {
  [DataWranglingScriptsRoutines.fetchOne.SUCCESS]: updateDataWranglingScript,
  [DataWranglingScriptsRoutines.fetchList.SUCCESS]: updateDataWranglingScripts,
  [DataWranglingScriptsRoutines.setImageScrapingFields.SUCCESS]: setImageScrapingFields,
  [DataWranglingScriptsRoutines.clearCustomScripts.TRIGGER]: clearCustomScripts,
  [DataWranglingScriptsRoutines.setScripts.TRIGGER]: setScriptsHandler,
  [DataWranglingScriptsRoutines.setCheckedScripts.TRIGGER]: setCheckedScriptsHandler,
});
