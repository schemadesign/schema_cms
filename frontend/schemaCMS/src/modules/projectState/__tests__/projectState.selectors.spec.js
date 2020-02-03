import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectProjectStateDomain, selectState, selectStates } from '../projectState.selectors';

describe('ProjectState: selectors', () => {
  const state = Immutable({
    projectState: {
      state: {},
      states: [],
    },
  });

  describe('selectDataSourceTagDomain', () => {
    it('should select a domain', () => {
      expect(selectProjectStateDomain(state)).to.equal(state.projectState);
    });
  });

  describe('selectStates', () => {
    it('should select a states', () => {
      expect(selectStates(state)).to.equal(state.projectState.states);
    });
  });

  describe('selectState', () => {
    it('should select a state', () => {
      expect(selectState(state)).to.equal(state.projectState.state);
    });
  });
});
