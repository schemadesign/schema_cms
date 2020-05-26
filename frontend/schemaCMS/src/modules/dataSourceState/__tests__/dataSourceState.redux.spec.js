import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { reducer as dataSourceStateReducer, DataSourceStateRoutines } from '../dataSourceState.redux';

describe('DataSourceState: redux', () => {
  const state = Immutable({
    state: {},
    states: [],
  });

  describe('reducer', () => {
    it('should return initial state', () => {
      expect(dataSourceStateReducer(undefined, {})).to.deep.equal(state);
    });

    it('should return state on unknown action', () => {
      expect(dataSourceStateReducer(state, { type: 'unknown-action' })).to.deep.equal(state);
    });

    describe('when DATA_SOURCE_STATE/FETCH_LIST action is received', () => {
      it('should set states', () => {
        const states = [{ data: 'data' }];

        const resultState = dataSourceStateReducer(state, DataSourceStateRoutines.fetchList.success(states));
        expect(resultState.states).to.deep.equal(states);
      });
    });

    describe('when DATA_SOURCE_STATE/FETCH_ONE action is received', () => {
      it('should set state', () => {
        const dataSourceState = { data: 'data' };

        const resultState = dataSourceStateReducer(state, DataSourceStateRoutines.fetchOne.success(dataSourceState));
        expect(resultState.state).to.deep.equal(dataSourceState);
      });
    });

    describe('when DATA_SOURCE_STATE/UPDATE action is received', () => {
      it('should set state', () => {
        const dataSourceState = { data: 'data' };

        const resultState = dataSourceStateReducer(state, DataSourceStateRoutines.update.success(dataSourceState));
        expect(resultState.state).to.deep.equal(dataSourceState);
      });
    });

    describe('when DATA_SOURCE_STATE/CREATE action is received', () => {
      it('should set state', () => {
        const dataSourceState = { data: 'data' };

        const resultState = dataSourceStateReducer(state, DataSourceStateRoutines.create.success(dataSourceState));
        expect(resultState.state).to.deep.equal(dataSourceState);
      });
    });
  });
});
