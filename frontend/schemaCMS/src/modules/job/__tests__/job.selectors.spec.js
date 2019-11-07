import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectJobDomain, selectJob, selectJobPreview, selectJobList, selectIsAnyJobSuccessful } from '../job.selectors';
import { JOB_STATE_FAILURE, JOB_STATE_SUCCESS } from '../job.constants';

describe('Job: selectors', () => {
  const state = Immutable({
    job: {
      job: {
        id: 1,
      },
      jobPreview: {},
      jobList: [],

    },
  });

  describe('selectJobDomain', () => {
    it('should select a domain', () => {
      expect(selectJobDomain(state)).to.equal(state.job);
    });
  });

  describe('selectJob', () => {
    it('should select a job', () => {
      expect(selectJob(state)).to.equal(state.job.job);
    });
  });

  describe('selectJobPreview', () => {
    it('should select a job preview', () => {
      expect(selectJobPreview(state)).to.equal(state.job.jobPreview);
    });
  });

  describe('selectJobList', () => {
    it('should select job list', () => {
      expect(selectJobList(state)).to.equal(state.job.jobList);
    });
  });

  describe('selectIsAnyJobSuccessful', () => {
    it('should select true if a job is successful', () => {
      const modifiedState = {
        job: {
          ...state.job,
          jobList: [{ id: 1, jobState: JOB_STATE_SUCCESS }, { id: 2, jobState: JOB_STATE_FAILURE }],
        },
      };

      expect(selectIsAnyJobSuccessful(modifiedState)).to.equal(true);
    });

    it('should select false if a job is not successful', () => {
      const modifiedState = {
        job: {
          ...state.job,
          jobList: [{ id: 1, jobState: JOB_STATE_FAILURE }, { id: 2, jobState: JOB_STATE_FAILURE }],
        },
      };

      expect(selectIsAnyJobSuccessful(modifiedState)).to.equal(false);
    });
  });
});
