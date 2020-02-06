import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { reducer as projectStateReducer, ProjectStateRoutines } from '../projectState.redux';

describe('ProjectState: redux', () => {
  const state = Immutable({
    state: {},
    states: [],
  });

  describe('reducer', () => {
    it('should return initial state', () => {
      expect(projectStateReducer(undefined, {})).to.deep.equal(state);
    });

    it('should return state on unknown action', () => {
      expect(projectStateReducer(state, { type: 'unknown-action' })).to.deep.equal(state);
    });

    describe('when PROJECT_STATE/FETCH_LIST action is received', () => {
      it('should set states', () => {
        const states = [{ data: 'data' }];

        const resultState = projectStateReducer(state, ProjectStateRoutines.fetchList.success(states));
        expect(resultState.states).to.deep.equal(states);
      });
    });

    describe('when PROJECT_STATE/FETCH_ONE action is received', () => {
      it('should set state', () => {
        const projectState = { data: 'data' };

        const resultState = projectStateReducer(state, ProjectStateRoutines.fetchOne.success(projectState));
        expect(resultState.state).to.deep.equal(projectState);
      });
    });

    describe('when PROJECT_STATE/UPDATE action is received', () => {
      it('should set state', () => {
        const projectState = { data: 'data' };

        const resultState = projectStateReducer(state, ProjectStateRoutines.update.success(projectState));
        expect(resultState.state).to.deep.equal(projectState);
      });
    });

    describe('when PROJECT_STATE/CREATE action is received', () => {
      it('should set state', () => {
        const projectState = { data: 'data' };

        const resultState = projectStateReducer(state, ProjectStateRoutines.create.success(projectState));
        expect(resultState.state).to.deep.equal(projectState);
      });
    });
  });
});
