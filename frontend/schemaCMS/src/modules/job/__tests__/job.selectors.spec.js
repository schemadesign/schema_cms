import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectJobDomain, selectJob, selectJobPreview } from '../job.selectors';

describe('Job: selectors', () => {
  const state = Immutable({
    job: {
      job: {
        id: 1,
      },
      jobPreview: {},
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
});
