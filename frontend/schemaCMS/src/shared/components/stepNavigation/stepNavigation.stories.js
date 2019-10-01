import React from 'react';
import { storiesOf } from '@storybook/react';

import { StepNavigation } from './stepNavigation.component';
import { STATUS_DRAFT } from '../../../modules/dataSource/dataSource.constants';
import { withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  loading: false,
  submitForm: null,
  dataSource: { status: STATUS_DRAFT },
  history: {
    push: Function.prototype,
  },
  match: {
    params: {
      projectId: '1',
      dataSourceId: '1',
      step: '1',
    },
  },
};

export const nextStepProps = {
  ...defaultProps,
  match: {
    params: {
      projectId: '1',
      dataSourceId: '1',
      step: '4',
    },
  },
};

storiesOf('Shared Components/StepNavigation', module)
  .addDecorator(withTheme())
  .add('Default', () => <StepNavigation {...defaultProps} />)
  .add('Next step', () => <StepNavigation {...nextStepProps} />);
