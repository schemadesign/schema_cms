import React from 'react';
import { storiesOf } from '@storybook/react';

import { CopyButton } from './copyButton.component';

export const defaultProps = {
  action: Function.prototype,
  loading: false,
  error: false,
  name: 'id',
};

storiesOf('CopyButton', module).add('Default', () => <CopyButton {...defaultProps} />);
