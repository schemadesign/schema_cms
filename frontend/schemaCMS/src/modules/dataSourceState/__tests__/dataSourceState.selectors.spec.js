import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectDataSourceStateDomain, selectState, selectStates } from '../dataSourceState.selectors';

describe('DataSourceState: selectors', () => {
  const state = Immutable({
    dataSourceState: {
      state: {},
      states: [],
    },
  });

  describe('selectDataSourceTagDomain', () => {
    it('should select a domain', () => {
      expect(selectDataSourceStateDomain(state)).to.equal(state.dataSourceState);
    });
  });

  describe('selectStates', () => {
    it('should select a states', () => {
      expect(selectStates(state)).to.equal(state.dataSourceState.states);
    });
  });

  describe('selectState', () => {
    it('should select a state', () => {
      expect(selectState(state)).to.equal(state.dataSourceState.state);
    });
  });
});
