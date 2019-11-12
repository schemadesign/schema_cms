import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { JobRoutines, reducer as jobReducer } from '../job.redux';

describe('Job: redux', () => {
  const state = Immutable({
    job: {},
    jobPreview: {},
    jobList: [],
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

  describe('when JOB/FETCH_JOB_LIST_SUCCESS action is received', () => {
    it('should set job list value', () => {
      const jobList = [{ id: '1' }];

      const resultState = jobReducer(state, JobRoutines.fetchJobList.success(jobList));
      expect(resultState.jobList).to.deep.equal(jobList);
    });
  });

  describe('when JOB/FETCH_ONE action is received', () => {
    it('should set job preview value', () => {
      const jobPreview = { fields: {}, data: [] };

      const resultState = jobReducer(state, JobRoutines.fetchPreview.success(jobPreview));
      expect(resultState.jobPreview).to.deep.equal(jobPreview);
    });
  });
});
