import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';

const prefix = 'DATA_WRANGLING_RESULT/';

export const DataWranglingResultRoutines = {
  fetch: createRoutine(`${prefix}FETCH`),
  unmount: createRoutine(`${prefix}UNMOUNT`),
};

export const INITIAL_STATE = new Immutable({
  fields: null,
  previewTable: [],
});

const fetchSuccess = (state = INITIAL_STATE, { payload }) =>
  state.set('fields', payload.fields).set('previewTable', payload.data);
const fetchFailure = (state = INITIAL_STATE) => state.set('fields', {});
const unmountResult = (state = INITIAL_STATE) => state.merge(INITIAL_STATE);

export const reducer = createReducer(INITIAL_STATE, {
  [DataWranglingResultRoutines.fetch.SUCCESS]: fetchSuccess,
  [DataWranglingResultRoutines.fetch.FAILURE]: fetchFailure,
  [DataWranglingResultRoutines.unmount.TRIGGER]: unmountResult,
});
