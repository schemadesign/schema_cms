import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectSectionsDomain, selectSection, selectSections, selectInternalConnections } from '../sections.selectors';
import { internalConnections, section, sections } from '../sections.mocks';

describe('Sections: selectors', () => {
  const state = Immutable({
    sections: {
      section,
      sections,
      internalConnections,
    },
  });

  describe('selectSectionsDomain', () => {
    it('should select a domain', () => {
      expect(selectSectionsDomain(state)).to.equal(state.sections);
    });
  });

  describe('selectSections', () => {
    it('should select a sections', () => {
      expect(selectSections(state)).to.equal(state.sections.sections);
    });
  });

  describe('selectInternalConnections', () => {
    it('should select a internalConnections', () => {
      expect(selectInternalConnections(state)).to.equal(state.sections.internalConnections);
    });
  });

  describe('selectSection', () => {
    it('should select a section', () => {
      expect(selectSection(state)).to.equal(state.sections.section);
    });
  });
});
