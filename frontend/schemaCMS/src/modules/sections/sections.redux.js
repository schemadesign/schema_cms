import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';
import { sortBy, path, propEq, pipe, evolve, reverse } from 'ramda';

import { SECTIONS_NAME, SECTIONS_PUBLISH, SECTIONS_RSS } from './sections.constants';

const PREFIX = 'SECTIONS/';

export const SectionsRoutines = {
  fetchSections: createRoutine(`${PREFIX}FETCH_SECTIONS`),
  fetchInternalConnections: createRoutine(`${PREFIX}FETCH_INTERNAL_CONNECTIONS`),
  fetchSection: createRoutine(`${PREFIX}FETCH_SECTION`),
  createSection: createRoutine(`${PREFIX}CREATE_SECTION`),
  updateSection: createRoutine(`${PREFIX}UPDATE_SECTION`),
  removeSection: createRoutine(`${PREFIX}REMOVE_SECTION`),
  fetchPages: createRoutine(`${PREFIX}FETCH_PAGES`),
};

export const INITIAL_STATE = new Immutable({
  section: {
    pages: [],
    [SECTIONS_NAME]: '',
    [SECTIONS_PUBLISH]: false,
    [SECTIONS_RSS]: false,
  },
  pages: {
    count: 0,
    results: [],
  },
  sections: [],
  internalConnections: [],
});

const setSections = (state = INITIAL_STATE, { payload }) => state.set('sections', payload);
const setInternalConnections = (state = INITIAL_STATE, { payload }) => state.set('internalConnections', payload);

const reorderPages = evolve({
  results: pipe(
    sortBy(result => {
      const mainPageId = path(['section', 'mainPage', 'id'])(result);
      return propEq('id', mainPageId)(result);
    }),
    reverse
  ),
});

const setSection = (state = INITIAL_STATE, { payload }) => state.set('section', payload);

const setPages = (state = INITIAL_STATE, { payload }) =>
  state.set('pages', payload.isQuery ? payload : reorderPages(payload));

export const reducer = createReducer(INITIAL_STATE, {
  [SectionsRoutines.fetchSections.SUCCESS]: setSections,
  [SectionsRoutines.fetchInternalConnections.SUCCESS]: setInternalConnections,
  [SectionsRoutines.fetchSection.SUCCESS]: setSection,
  [SectionsRoutines.fetchPages.SUCCESS]: setPages,
  [SectionsRoutines.updateSection.SUCCESS]: setSection,
});
