import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';

const PREFIX = 'PAGE/';

export const PageRoutines = {
  fetchList: createRoutine(`${PREFIX}FETCH_LIST`),
  create: createRoutine(`${PREFIX}CREATE`),
};

export const INITIAL_STATE = new Immutable({
  pages: [],
  page: {},
});

const setPages = (state = INITIAL_STATE, { payload }) => state.set('pages', payload);
const setPage = (state = INITIAL_STATE, { payload }) => state.set('page', payload);

export const reducer = createReducer(INITIAL_STATE, {
  [PageRoutines.fetchList.success]: setPages,
  [PageRoutines.create.success]: setPage,
});
