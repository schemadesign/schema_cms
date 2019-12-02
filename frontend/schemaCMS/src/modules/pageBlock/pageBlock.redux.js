import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';

const PREFIX = 'PAGE_BLOCK/';

export const PageBlockRoutines = {
  fetchList: createRoutine(`${PREFIX}FETCH_LIST`),
  fetchOne: createRoutine(`${PREFIX}FETCH_ONE`),
  setBlocks: createRoutine(`${PREFIX}SET_BLOCKS`),
  create: createRoutine(`${PREFIX}CREATE`),
  update: createRoutine(`${PREFIX}UPDATE`),
  removeOne: createRoutine(`${PREFIX}REMOVE_ONE`),
};

export const INITIAL_STATE = new Immutable({
  pageBlocks: [],
  pageBlock: {},
});

const setBlocks = (state = INITIAL_STATE, { payload }) => state.set('pageBlocks', payload);
const setBlock = (state = INITIAL_STATE, { payload }) => state.set('pageBlock', payload);

export const reducer = createReducer(INITIAL_STATE, {
  [PageBlockRoutines.fetchList.success]: setBlocks,
  [PageBlockRoutines.setBlocks.success]: setBlocks,
  [PageBlockRoutines.fetchOne.success]: setBlock,
});
