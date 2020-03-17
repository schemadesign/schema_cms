import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { reducer as sectionsReducer, SectionsRoutines } from '../sections.redux';

describe('Sections: redux', () => {
  const state = Immutable({
    section: { isPublish: false, name: '', pages: [] },
    sections: [],
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
    it('should set page templates', () => {
      const sections = [{ data: 'data' }];
      const resultState = sectionsReducer(state, SectionsRoutines.fetchSections.success(sections));

      expect(resultState.sections).to.deep.equal(sections);
    });
  });

  describe('when SECTIONS/FETCH_SECTION_SUCCESS action is received', () => {
    it('should set page templates', () => {
      const section = { data: 'data' };
      const resultState = sectionsReducer(state, SectionsRoutines.fetchSection.success(section));

      expect(resultState.section).to.deep.equal(section);
    });
  });
});
