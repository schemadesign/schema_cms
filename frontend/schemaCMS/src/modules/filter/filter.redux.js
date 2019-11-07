import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';

const PREFIX = 'FILTER/';

export const FilterRoutines = {
  fetchList: createRoutine(`${PREFIX}FETCH_LIST`),
  createFilter: createRoutine(`${PREFIX}CREATE_FILTER`),
  setFilters: createRoutine(`${PREFIX}SET_FILTERS`),
  fetchFilter: createRoutine(`${PREFIX}FETCH_FILTER`),
  removeFilter: createRoutine(`${PREFIX}REMOVE_FILTER`),
  updateFilter: createRoutine(`${PREFIX}UPDATE_FILTER`),
};

export const INITIAL_STATE = new Immutable({
  filters: [],
  filter: {},
});

const setFilters = (state = INITIAL_STATE, { payload }) => state.set('filters', payload);
const setFilter = (state = INITIAL_STATE, { payload }) => state.set('filter', payload);

export const reducer = createReducer(INITIAL_STATE, {
  [FilterRoutines.fetchList.success]: setFilters,
  [FilterRoutines.setFilters.success]: setFilters,
  [FilterRoutines.fetchFilter.success]: setFilter,
});
