import React from 'react';
import { storiesOf } from '@storybook/react';

import { PillButtons } from './pillButtons.component';

const defaultProps = {
  leftButtonProps: {
    title: 'left title',
  },
  rightButtonProps: {
    title: 'right title',
  },
};

storiesOf('Shared Components/PillButtons', module).add('Default', () => <PillButtons {...defaultProps} />);
