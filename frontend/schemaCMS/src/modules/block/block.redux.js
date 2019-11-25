import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';

const PREFIX = 'BLOCK/';

export const BlockRoutines = {
  fetchList: createRoutine(`${PREFIX}FETCH_LIST`),
  setBlocks: createRoutine(`${PREFIX}SET_BLOCKS`),
};

export const INITIAL_STATE = new Immutable({
  blocks: [],
});

const setBlocks = (state = INITIAL_STATE, { payload }) => state.set('blocks', payload);

export const reducer = createReducer(INITIAL_STATE, {
  [BlockRoutines.fetchList.success]: setBlocks,
  [BlockRoutines.setBlocks.success]: setBlocks,
});
