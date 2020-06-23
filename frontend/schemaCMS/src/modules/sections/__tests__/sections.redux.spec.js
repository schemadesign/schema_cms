import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { reducer as sectionsReducer, SectionsRoutines } from '../sections.redux';
import { section as sectionMock } from '../sections.mocks';

describe('Sections: redux', () => {
  const state = Immutable({
    section: { isPublic: false, name: '', pages: [] },
    sections: [],
    pages: {
      count: 0,
      results: [],
    },
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

  describe('when SECTIONS/FETCH_PAGES_SUCCESS action is received', () => {
    it('should set pages', () => {
      const pages = [{ data: 'data' }];
      const resultState = sectionsReducer(state, SectionsRoutines.fetchPages.success(pages));

      expect(resultState.pages).to.deep.equal(pages);
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

  describe('when SECTIONS/FETCH_PAGES_SUCCESS action is received', () => {
    it('should set page', () => {
      const pages = { data: 'data' };
      const resultState = sectionsReducer(state, SectionsRoutines.fetchPages.success(pages));

      expect(resultState.pages).to.deep.equal(pages);
    });
  });

  describe('when SECTIONS/UPDATE_SECTION_SUCCESS action is received', () => {
    it('should update section', () => {
      const section = { data: 'data' };
      const resultState = sectionsReducer(state, SectionsRoutines.updateSection.success(section));

      expect(resultState.section).to.deep.equal(section);
    });

    it('should move main page to beginning of pages (reversed order)', () => {
      const section = sectionMock;
      const resultState = sectionsReducer(state, SectionsRoutines.updateSection.success(section));

      expect(resultState.section).to.deep.equal({
        created: '2020-03-09T10:41:17+0000',
        createdBy: 'owner',
        id: 1,
        isPublic: true,
        mainPage: 3,
        name: 'Section name',
        pages: [
          {
            created: '2020-03-09T10:41:17+0000',
            createdBy: 'owner',
            displayName: 'page-name',
            id: 1,
            name: 'page name',
            templateName: 'templateName',
          },
          { created: '2020-03-09T10:41:17+0000', createdBy: 'owner', id: 2, name: 'page name 2', templateName: null },
          {
            createdBy: 'owner',
            created: '2020-03-09T10:41:17+0000',
            name: 'page name 3',
            id: 3,
            templateName: null,
          },
        ],
        pagesCount: 1,
        slug: 'section-name',
      });
    });
  });
});
