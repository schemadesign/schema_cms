import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';

const PREFIX = 'PAGE_TEMPLATES/';

export const PageTemplatesRoutines = {
  fetchPageTemplates: createRoutine(`${PREFIX}FETCH_PAGE_TEMPLATES`),
};

export const INITIAL_STATE = new Immutable({ pageTemplates: [] });

const setPageTemplates = (state = INITIAL_STATE, { payload }) => state.set('pageTemplates', payload);

export const reducer = createReducer(INITIAL_STATE, {
  [PageTemplatesRoutines.fetchPageTemplates.SUCCESS]: setPageTemplates,
});
