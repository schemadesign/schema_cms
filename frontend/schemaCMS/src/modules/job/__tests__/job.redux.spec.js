import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { JobRoutines, reducer as jobReducer } from '../job.redux';

describe('Job: redux', () => {
  const state = Immutable({
    job: {},
  });

  describe('reducer', () => {
    it('should return initial state', () => {
      expect(jobReducer(undefined, {})).to.deep.equal(state);
    });

    it('should return state on unknown action', () => {
      expect(jobReducer(state, { type: 'unknown-action' })).to.deep.equal(state);
    });
  });

  describe('when JOB/FETCH_ONE action is received', () => {
    it('should set job value', () => {
      const job = {
        pk: 1,
      };

      const resultState = jobReducer(state, JobRoutines.fetchOne.success({ pk: 1 }));
      expect(resultState.job).to.deep.equal(job);
    });
  });

  describe('when JOB/UPDATE_ONE action is received', () => {
    it('should set job value', () => {
      const job = {
        pk: 1,
      };

      const resultState = jobReducer(state, JobRoutines.updateOne.success({ pk: 1 }));
      expect(resultState.job).to.deep.equal(job);
    });
  });
});
