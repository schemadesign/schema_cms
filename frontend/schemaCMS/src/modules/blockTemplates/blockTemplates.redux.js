import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';

const PREFIX = 'BLOCK_TEMPLATES/';

export const BlockTemplatesRoutines = {
  fetchBlocks: createRoutine(`${PREFIX}FETCH_BLOCKS`),
  createBlockTemplate: createRoutine(`${PREFIX}CREATE_BLOCK_TEMPLATE`),
};

export const INITIAL_STATE = new Immutable({
  blocks: [],
  block: {},
});

const setBlocks = (state = INITIAL_STATE, { payload }) => state.set('blocks', payload);

export const reducer = createReducer(INITIAL_STATE, {
  [BlockTemplatesRoutines.fetchBlocks.SUCCESS]: setBlocks,
});
