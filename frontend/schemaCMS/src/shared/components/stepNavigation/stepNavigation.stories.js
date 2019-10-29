import React from 'react';
import { storiesOf } from '@storybook/react';

import { StepNavigation } from './stepNavigation.component';
import { withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  loading: false,
  submitForm: null,
  dataSource: { metaData: null },
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

const loadingProps = {
  ...defaultProps,
  loading: true,
};

const disabledBackProps = {
  ...defaultProps,
  disabled: {
    back: true,
  },
};

const disabledNextProps = {
  ...defaultProps,
  disabled: {
    next: true,
  },
};

storiesOf('Shared Components|StepNavigation', module)
  .addDecorator(withTheme())
  .add('Default', () => <StepNavigation {...defaultProps} />)
  .add('Next step', () => <StepNavigation {...nextStepProps} />)
  .add('Loading', () => <StepNavigation {...loadingProps} />)
  .add('Disabled back', () => <StepNavigation {...disabledBackProps} />)
  .add('Disabled next', () => <StepNavigation {...disabledNextProps} />);
