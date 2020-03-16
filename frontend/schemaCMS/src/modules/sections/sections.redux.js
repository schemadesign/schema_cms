import { createReducer } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { createRoutine } from 'redux-saga-routines';

const PREFIX = 'SECTIONS/';

export const SectionsRoutines = {
  fetchSections: createRoutine(`${PREFIX}FETCH_SECTIONS`),
  fetchSection: createRoutine(`${PREFIX}FETCH_SECTION`),
  createSection: createRoutine(`${PREFIX}CREATE_SECTION`),
  updateSection: createRoutine(`${PREFIX}UPDATE_SECTION`),
  removeSection: createRoutine(`${PREFIX}REMOVE_SECTION`),
};

export const INITIAL_STATE = new Immutable({
  section: {},
  sections: [],
});

const setSections = (state = INITIAL_STATE, { payload }) => state.set('sections', payload);
const setSection = (state = INITIAL_STATE, { payload }) => state.set('section', payload);

export const reducer = createReducer(INITIAL_STATE, {
  [SectionsRoutines.fetchSections.SUCCESS]: setSections,
  [SectionsRoutines.fetchSection.SUCCESS]: setSection,
});
