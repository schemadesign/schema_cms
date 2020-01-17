import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';

const PREFIX = 'PAGE_BLOCK/';

export const PageBlockRoutines = {
  fetchList: createRoutine(`${PREFIX}FETCH_LIST`),
  fetchOne: createRoutine(`${PREFIX}FETCH_ONE`),
  saveTemporaryBlocks: createRoutine(`${PREFIX}SAVE_TEMPORARY_BLOCKS`),
  setBlocks: createRoutine(`${PREFIX}SET_BLOCKS`),
  create: createRoutine(`${PREFIX}CREATE`),
  update: createRoutine(`${PREFIX}UPDATE`),
  removeOne: createRoutine(`${PREFIX}REMOVE_ONE`),
};

export const INITIAL_STATE = new Immutable({
  pageBlocks: [],
  pageBlock: {},
  temporaryPageBlocks: [],
});

const setBlocks = (state = INITIAL_STATE, { payload }) => state.set('pageBlocks', payload);
const setBlock = (state = INITIAL_STATE, { payload }) => state.set('pageBlock', payload);
const saveTemporaryBlocks = (state = INITIAL_STATE, { payload }) => state.set('temporaryPageBlocks', payload);
const removeFromTemporaryBlocks = (state = INITIAL_STATE, { payload: { blockId } }) =>
  state.update('temporaryPageBlocks', blocks => blocks.filter(({ id }) => id.toString() !== blockId));
const addToTemporaryBlocks = (state = INITIAL_STATE, { payload }) =>
  state.update('temporaryPageBlocks', blocks => (blocks.length ? blocks.concat(payload) : []));
const updateTemporaryBlocks = (state = INITIAL_STATE, { payload: { id, name } }) =>
  state.update('temporaryPageBlocks', blocks =>
    blocks.length ? blocks.map(block => (id === block.id ? { ...block, name } : block)) : []
  );

export const reducer = createReducer(INITIAL_STATE, {
  [PageBlockRoutines.fetchList.success]: setBlocks,
  [PageBlockRoutines.setBlocks.success]: setBlocks,
  [PageBlockRoutines.saveTemporaryBlocks.trigger]: saveTemporaryBlocks,
  [PageBlockRoutines.fetchOne.success]: setBlock,
  [PageBlockRoutines.removeOne.success]: removeFromTemporaryBlocks,
  [PageBlockRoutines.create.success]: addToTemporaryBlocks,
  [PageBlockRoutines.update.success]: updateTemporaryBlocks,
});
