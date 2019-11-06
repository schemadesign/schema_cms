import React from 'react';
import { storiesOf } from '@storybook/react';

import { JobList } from './jobList.component';

export const defaultProps = {
  fetchJobList: Function.prototype,
  revertToJob: Function.prototype,
  jobList: [],
  isAnyJobSuccessful: false,
  history: {
    push: Function.prototype,
  },
  match: {
    params: {
      dataSourceId: '1',
    },
  },
};

storiesOf('JobList', module).add('Default', () => <JobList {...defaultProps} />);
