import { expect } from 'chai';
import Immutable from 'seamless-immutable';

import { selectJobDomain } from '../job.selectors';

describe('Job: selectors', () => {
  const state = Immutable({
    job: {},
  });

  describe('selectJobDomain', () => {
    it('should select a domain', () => {
      expect(selectJobDomain(state)).to.equal(state.job);
    });
  });
});
