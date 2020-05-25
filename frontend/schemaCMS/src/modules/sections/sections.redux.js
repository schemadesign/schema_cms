import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';
import { evolve, findIndex, identity, ifElse, move, propEq } from 'ramda';

import { SECTIONS_NAME, SECTIONS_PUBLISH } from './sections.constants';

const PREFIX = 'SECTIONS/';

export const SectionsRoutines = {
  fetchSections: createRoutine(`${PREFIX}FETCH_SECTIONS`),
  fetchInternalConnections: createRoutine(`${PREFIX}FETCH_INTERNAL_CONNECTIONS`),
  fetchSection: createRoutine(`${PREFIX}FETCH_SECTION`),
  createSection: createRoutine(`${PREFIX}CREATE_SECTION`),
  updateSection: createRoutine(`${PREFIX}UPDATE_SECTION`),
  removeSection: createRoutine(`${PREFIX}REMOVE_SECTION`),
};

export const INITIAL_STATE = new Immutable({
  section: {
    pages: [],
    [SECTIONS_NAME]: '',
    [SECTIONS_PUBLISH]: false,
  },
  sections: [],
  internalConnections: [],
});

const setSections = (state = INITIAL_STATE, { payload }) => state.set('sections', payload);
const setInternalConnections = (state = INITIAL_STATE, { payload }) => state.set('internalConnections', payload);
const setSection = (state = INITIAL_STATE, { payload }) =>
  state.set(
    'section',
    ifElse(
      propEq('mainPage', null),
      identity,
      evolve({ pages: pages => move(findIndex(propEq('id', payload.mainPage), pages), 0, pages) })
    )(payload)
  );

export const reducer = createReducer(INITIAL_STATE, {
  [SectionsRoutines.fetchSections.SUCCESS]: setSections,
  [SectionsRoutines.fetchInternalConnections.SUCCESS]: setInternalConnections,
  [SectionsRoutines.fetchSection.SUCCESS]: setSection,
  [SectionsRoutines.updateSection.SUCCESS]: setSection,
});
