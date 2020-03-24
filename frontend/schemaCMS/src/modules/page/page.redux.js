import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';
import {
  PAGE_NAME,
  PAGE_IS_PUBLIC,
  PAGE_TEMPLATE,
  PAGE_DISPLAY_NAME,
  PAGE_DESCRIPTION,
  PAGE_KEYWORDS,
} from './page.constants';

const PREFIX = 'PAGE/';

export const PageRoutines = {
  createPage: createRoutine(`${PREFIX}CREATE_PAGE`),
  fetchPage: createRoutine(`${PREFIX}FETCH_PAGE`),
  updatePage: createRoutine(`${PREFIX}UPDATE_PAGE`),
  removePage: createRoutine(`${PREFIX}REMOVE_PAGE`),
  setTemporaryPageBlocks: createRoutine(`${PREFIX}SET_TEMPORARY_PAGE_BLOCKS`),
};

export const INITIAL_STATE = new Immutable({
  page: {
    [PAGE_NAME]: '',
    [PAGE_TEMPLATE]: '',
    [PAGE_DISPLAY_NAME]: '',
    [PAGE_DESCRIPTION]: '',
    [PAGE_KEYWORDS]: '',
    [PAGE_IS_PUBLIC]: false,
  },
  temporaryPageBlocks: [],
});

const setPage = (state = INITIAL_STATE, { payload }) => state.set('page', payload);
const setTemporaryPageBlocks = (state = INITIAL_STATE, { payload }) => state.set('temporaryPageBlocks', payload);

export const reducer = createReducer(INITIAL_STATE, {
  [PageRoutines.updatePage.success]: setPage,
  [PageRoutines.fetchPage.success]: setPage,
  [PageRoutines.setTemporaryPageBlocks.trigger]: setTemporaryPageBlocks,
});
