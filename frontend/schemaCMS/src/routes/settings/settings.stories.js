import React from 'react';
import { storiesOf } from '@storybook/react';

import { Settings } from './settings.component';
import { withTheme } from '../../.storybook/decorators';

export const defaultProps = {
  updateMe: Function.prototype,
  userData: {},
  history: { push: Function.prototype },
  intl: { formatMessage: ({ defaultMessage }) => defaultMessage },
};

storiesOf('Settings', module)
  .addDecorator(withTheme())
  .add('Default', () => <Settings {...defaultProps} />);
