import React from 'react';
import { storiesOf } from '@storybook/react';

import { CardHeader } from './cardHeader.component';
import { withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  list: ['item', 'item 2'],
};

storiesOf('CardHeader', module)
  .addDecorator(withTheme())
  .add('Default', () => <CardHeader {...defaultProps} />);
