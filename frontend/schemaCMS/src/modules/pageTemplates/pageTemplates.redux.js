import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';

const PREFIX = 'PAGE_TEMPLATES/';

export const PageTemplatesRoutines = {
  fetchPageTemplates: createRoutine(`${PREFIX}FETCH_PAGE_TEMPLATES`),
  fetchPageTemplate: createRoutine(`${PREFIX}FETCH_PAGE_TEMPLATE`),
  createPageTemplate: createRoutine(`${PREFIX}CREATE_PAGE_TEMPLATE`),
  updatePageTemplate: createRoutine(`${PREFIX}UPDATE_PAGE_TEMPLATE`),
  removePageTemplate: createRoutine(`${PREFIX}REMOVE_PAGE_TEMPLATE`),
};

export const INITIAL_STATE = new Immutable({ pageTemplates: [], pageTemplate: {} });

const setPageTemplates = (state = INITIAL_STATE, { payload }) => state.set('pageTemplates', payload);
const setPageTemplate = (state = INITIAL_STATE, { payload }) => state.set('pageTemplate', payload);

export const reducer = createReducer(INITIAL_STATE, {
  [PageTemplatesRoutines.fetchPageTemplates.SUCCESS]: setPageTemplates,
  [PageTemplatesRoutines.fetchPageTemplate.SUCCESS]: setPageTemplate,
});
