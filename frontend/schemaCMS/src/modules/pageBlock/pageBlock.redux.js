import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';

const PREFIX = 'PAGE_BLOCK/';

export const PageBlockRoutines = {
  fetchList: createRoutine(`${PREFIX}FETCH_LIST`),
  setBlocks: createRoutine(`${PREFIX}SET_BLOCKS`),
};

export const INITIAL_STATE = new Immutable({
  pageBlocks: [],
});

const setBlocks = (state = INITIAL_STATE, { payload }) => state.set('pageBlocks', payload);

export const reducer = createReducer(INITIAL_STATE, {
  [PageBlockRoutines.fetchList.success]: setBlocks,
  [PageBlockRoutines.setBlocks.success]: setBlocks,
});
