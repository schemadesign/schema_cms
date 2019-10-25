import React from 'react';
import { storiesOf } from '@storybook/react';

import { JobDetail } from './jobDetail.component';
import { INITIAL_VALUES } from '../../modules/job/job.constants';

export const defaultProps = {
  job: {},
  fetchOne: Function.prototype,
  values: INITIAL_VALUES,
  match: {
    params: {
      jobId: '1',
    },
  },
};

storiesOf('JobDetail', module).add('Default', () => <JobDetail {...defaultProps} />);
