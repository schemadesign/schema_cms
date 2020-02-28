import React from 'react';
import { storiesOf } from '@storybook/react';

import { CounterHeader } from './counterHeader.component';
import { withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  copy: 'copy',
  count: 3,
};

storiesOf('CounterHeader', module)
  .addDecorator(withTheme())
  .add('Default', () => <CounterHeader {...defaultProps} />);
