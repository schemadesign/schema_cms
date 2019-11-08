import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectJobDomain, selectJob, selectJobList } from '../job.selectors';

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

  describe('selectJobList', () => {
    it('should select job list', () => {
      expect(selectJobList(state)).to.equal(state.job.jobList);
    });
  });
});
