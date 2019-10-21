import React from 'react';
import { storiesOf } from '@storybook/react';

import { Settings } from './settings.component';
import { withRouter } from '../../.storybook/decorators';

export const defaultProps = {
  intl: {
    formatMessage: ({ defaultMessage }) => defaultMessage,
  },
  userData: {},
  updateMe: Function.prototype,
  match: {},
};

storiesOf('Settings', module)
  .addDecorator(withRouter)
  .add('Default', () => <Settings {...defaultProps} />);
