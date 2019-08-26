import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectProjectDomain } from '../project.selectors';

describe('Project: selectors', () => {
  const state = Immutable({
    project: {},
  });

  describe('selectProjectDomain', () => {
    it('should select a domain', () => {
      expect(selectProjectDomain(state)).to.equal(state.project);
    });
  });
});
