import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';

const PREFIX = 'PROJECT_STATE/';

export const ProjectStateRoutines = {
  fetchList: createRoutine(`${PREFIX}FETCH_LIST`),
  fetchOne: createRoutine(`${PREFIX}FETCH_ONE`),
  create: createRoutine(`${PREFIX}CREATE`),
  update: createRoutine(`${PREFIX}UPDATE`),
};

export const INITIAL_STATE = new Immutable({
  states: [],
  state: {},
});

const setStates = (state = INITIAL_STATE, { payload }) => state.set('states', payload);
const setState = (state = INITIAL_STATE, { payload }) => state.set('state', payload);

export const reducer = createReducer(INITIAL_STATE, {
  [ProjectStateRoutines.fetchList.success]: setStates,
  [ProjectStateRoutines.fetchOne.success]: setState,
  [ProjectStateRoutines.create.success]: setState,
  [ProjectStateRoutines.update.success]: setState,
});
