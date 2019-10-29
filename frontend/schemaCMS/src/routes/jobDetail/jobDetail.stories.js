import React from 'react';
import { storiesOf } from '@storybook/react';

import { JobDetail } from './jobDetail.component';
import { INITIAL_VALUES, JOB_STATE_SUCCESS } from '../../modules/job/job.constants';
import { withRouter } from '../../.storybook/decorators';

export const defaultProps = {
  job: {
    id: '1',
    jobState: JOB_STATE_SUCCESS,
    result: 'http://result',
    sourceFileUrl: 'http://sourceFileUrl',
  },
  fetchOne: Function.prototype,
  values: INITIAL_VALUES,
  history: {
    push: Function.prototype,
  },
  match: {
    params: {
      jobId: '1',
    },
  },
  dirty: true,
  isValid: true,
  handleSubmit: Function.prototype,
  handleChange: Function.prototype,
  steps: [{ scriptName: 'scriptName 1' }, { scriptName: 'scriptName 2' }, { scriptName: 'scriptName 3' }],
  intl: { formatMessage: ({ defaultMessage }) => defaultMessage },
};

storiesOf('JobDetail', module)
  .addDecorator(withRouter)
  .add('Default', () => <JobDetail {...defaultProps} />);
