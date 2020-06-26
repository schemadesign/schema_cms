import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';

const PREFIX = 'BLOCK_TEMPLATES/';

export const BlockTemplatesRoutines = {
  fetchBlockTemplates: createRoutine(`${PREFIX}FETCH_BLOCK_TEMPLATES`),
  fetchBlockTemplate: createRoutine(`${PREFIX}FETCH_BLOCK_TEMPLATE`),
  createBlockTemplate: createRoutine(`${PREFIX}CREATE_BLOCK_TEMPLATE`),
  updateBlockTemplate: createRoutine(`${PREFIX}UPDATE_BLOCK_TEMPLATE`),
  removeBlockTemplate: createRoutine(`${PREFIX}REMOVE_BLOCK_TEMPLATE`),
  copyBlockTemplate: createRoutine(`${PREFIX}COPY_BLOCK_TEMPLATE`),
};

export const INITIAL_STATE = new Immutable({
  blockTemplates: [],
  blockTemplate: {
    name: '',
    elements: [],
  },
});

const setBlockTemplates = (state = INITIAL_STATE, { payload }) => state.set('blockTemplates', payload);
const setBlockTemplate = (state = INITIAL_STATE, { payload }) => state.set('blockTemplate', payload);

export const reducer = createReducer(INITIAL_STATE, {
  [BlockTemplatesRoutines.fetchBlockTemplates.SUCCESS]: setBlockTemplates,
  [BlockTemplatesRoutines.fetchBlockTemplate.SUCCESS]: setBlockTemplate,
});
