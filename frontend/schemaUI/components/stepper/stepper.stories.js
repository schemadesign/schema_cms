import React from 'react';
import { storiesOf } from '@storybook/react';

import { Stepper } from './stepper.component';

const defaultProps = {
  steps: 6,
  activeStep: 1,
  onStepChange: () => {},
};

const withCustomStyles = {
  customStyles: {
    flexDirection: 'column',
  },
  customActiveDotStyles: {
    backgroundColor: 'red',
  },
  customDotStyles: {
    backgroundColor: 'blue',
    margin: '4px',
  },
};

storiesOf('Stepper', module)
  .add('Default', () => <Stepper {...defaultProps} />)
  .add('With custom styles', () => <Stepper {...defaultProps} {...withCustomStyles} />);
