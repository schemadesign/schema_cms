import React from 'react';
import { storiesOf } from '@storybook/react';

import { JobList } from './jobList.component';
import { JOB_STATE_SUCCESS } from '../../../modules/job/job.constants';
import { withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  fetchJobList: Function.prototype,
  revertToJob: Function.prototype,
  jobList: [],
  dataSource: { jobActive: 1 },
  history: {
    push: Function.prototype,
  },
  match: {
    params: {
      dataSourceId: '1',
    },
  },
};

export const propsWithJobs = {
  ...defaultProps,
  jobList: [
    { id: '1', created: '2019/08/12 09:45', jobState: JOB_STATE_SUCCESS },
    { id: '2', created: '2019/10/13 19:22', jobState: JOB_STATE_SUCCESS },
  ],
};

storiesOf('JobList', module)
  .addDecorator(withTheme())
  .add('Default', () => <JobList {...defaultProps} />);
