import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';

const PREFIX = 'DATA_SOURCE_STATE/';

export const DataSourceStateRoutines = {
  fetchList: createRoutine(`${PREFIX}FETCH_LIST`),
  fetchOne: createRoutine(`${PREFIX}FETCH_ONE`),
  create: createRoutine(`${PREFIX}CREATE`),
  update: createRoutine(`${PREFIX}UPDATE`),
  remove: createRoutine(`${PREFIX}REMOVE`),
};

export const INITIAL_STATE = new Immutable({
  states: [],
  state: {
    filters: [],
  },
});

const setStates = (state = INITIAL_STATE, { payload }) => state.set('states', payload);
const setState = (state = INITIAL_STATE, { payload }) => state.set('state', payload);

export const reducer = createReducer(INITIAL_STATE, {
  [DataSourceStateRoutines.fetchList.success]: setStates,
  [DataSourceStateRoutines.fetchOne.success]: setState,
  [DataSourceStateRoutines.create.success]: setState,
  [DataSourceStateRoutines.update.success]: setState,
});
