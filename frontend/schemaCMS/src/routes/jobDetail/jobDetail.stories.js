import React from 'react';
import { storiesOf } from '@storybook/react';

import { JobDetail } from './jobDetail.component';
import { INITIAL_VALUES, JOB_STATE_FAILURE, JOB_STATE_SUCCESS } from '../../modules/job/job.constants';
import { withTheme } from '../../.storybook/decorators';
import { history, intl } from '../../.storybook/helpers';

const successJob = {
  id: '1',
  jobState: JOB_STATE_SUCCESS,
  result: 'http://result',
  sourceFileUrl: 'http://sourceFileUrl',
  description: 'description',
  steps: [{ scriptName: 'scriptName 1' }, { scriptName: 'scriptName 2' }, { scriptName: 'scriptName 3' }],
};

export const failureJob = {
  id: '1',
  jobState: JOB_STATE_FAILURE,
  result: 'http://result',
  sourceFileUrl: 'http://sourceFileUrl',
  error: 'error',
  description: 'description',
  steps: [{ scriptName: 'scriptName 1' }, { scriptName: 'scriptName 2' }],
};

export const fakeJob = {
  id: '1',
  jobState: JOB_STATE_SUCCESS,
  result: 'http://result',
  sourceFileUrl: 'http://sourceFileUrl',
  description: 'description',
  steps: [],
};

export const defaultProps = {
  job: successJob,
  fetchOne: Function.prototype,
  match: {
    params: {
      jobId: '1',
    },
  },
  history,
  values: { ...INITIAL_VALUES, description: 'description' },
  dirty: true,
  isValid: true,
  handleSubmit: Function.prototype,
  handleChange: Function.prototype,
  intl,
  isSubmitting: false,
};

storiesOf('Data Source|JobDetail', module)
  .addDecorator(withTheme())
  .add('Success job', () => <JobDetail {...defaultProps} />)
  .add('Failure job', () => <JobDetail {...defaultProps} job={failureJob} />)
  .add('Fake job', () => <JobDetail {...defaultProps} job={fakeJob} />);
