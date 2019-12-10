import React from 'react';
import { storiesOf } from '@storybook/react';

import { JobDetail } from './jobDetail.component';
import { INITIAL_VALUES, JOB_STATE_SUCCESS } from '../../modules/job/job.constants';
import { withTheme } from '../../.storybook/decorators';
import { history, intl } from '../../.storybook/helpers';

export const defaultProps = {
  job: {
    id: '1',
    jobState: JOB_STATE_SUCCESS,
    result: 'http://result',
    sourceFileUrl: 'http://sourceFileUrl',
  },
  fetchOne: Function.prototype,
  values: INITIAL_VALUES,
  dirty: true,
  isValid: true,
  isSubmitting: false,
  handleSubmit: Function.prototype,
  handleChange: Function.prototype,
  steps: [{ scriptName: 'scriptName 1' }, { scriptName: 'scriptName 2' }, { scriptName: 'scriptName 3' }],
  history,
  intl,
  match: {
    params: {
      jobId: '1',
    },
  },
};

storiesOf('JobDetail', module)
  .addDecorator(withTheme())
  .add('Default', () => <JobDetail {...defaultProps} />);
