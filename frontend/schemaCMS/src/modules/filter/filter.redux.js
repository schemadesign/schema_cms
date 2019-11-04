import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';

const PREFIX = 'FILTER/';

export const FilterRoutines = {
  fetchList: createRoutine(`${PREFIX}FETCH_LIST`),
  setFilters: createRoutine(`${PREFIX}SET_FILTERS`),
};

export const INITIAL_STATE = new Immutable({
  filters: [],
});

const setFilters = (state = INITIAL_STATE, { payload }) => state.set('filters', payload);

export const reducer = createReducer(INITIAL_STATE, {
  [FilterRoutines.fetchList.success]: setFilters,
});
