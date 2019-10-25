import React from 'react';
import { storiesOf } from '@storybook/react';

import { JobDetail } from './jobDetail.component';

export const defaultProps = {
  job: {},
  fetchOne: Function.prototype,
  match: {
    params: {
      jobId: '1',
    },
  },
};

storiesOf('JobDetail', module).add('Default', () => <JobDetail {...defaultProps} />);
