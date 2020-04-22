import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { reducer as sectionsReducer, SectionsRoutines } from '../sections.redux';

describe('Sections: redux', () => {
  const state = Immutable({
    section: { isPublic: false, name: '', pages: [] },
    sections: [],
    internalConnections: [],
  });

  describe('reducer', () => {
    it('should return initial state', () => {
      expect(sectionsReducer(undefined, {})).to.deep.equal(state);
    });

    it('should return state on unknown action', () => {
      expect(sectionsReducer(state, { type: 'unknown-action' })).to.deep.equal(state);
    });
  });

  describe('when SECTIONS/FETCH_SECTIONS_SUCCESS action is received', () => {
    it('should set sections', () => {
      const sections = [{ data: 'data' }];
      const resultState = sectionsReducer(state, SectionsRoutines.fetchSections.success(sections));

      expect(resultState.sections).to.deep.equal(sections);
    });
  });

  describe('when SECTIONS/FETCH_INTERNAL_CONNECTIONS_SUCCESS action is received', () => {
    it('should set internal connections', () => {
      const internalConnections = [{ data: 'data' }];
      const resultState = sectionsReducer(
        state,
        SectionsRoutines.fetchInternalConnections.success(internalConnections)
      );

      expect(resultState.internalConnections).to.deep.equal(internalConnections);
    });
  });

  describe('when SECTIONS/FETCH_SECTION_SUCCESS action is received', () => {
    it('should set section', () => {
      const section = { data: 'data' };
      const resultState = sectionsReducer(state, SectionsRoutines.fetchSection.success(section));

      expect(resultState.section).to.deep.equal(section);
    });
  });

  describe('when SECTIONS/UPDATE_SECTION_SUCCESS action is received', () => {
    it('should update section', () => {
      const section = { data: 'data' };
      const resultState = sectionsReducer(state, SectionsRoutines.updateSection.success(section));

      expect(resultState.section).to.deep.equal(section);
    });
  });
});
