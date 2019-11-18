import React from 'react';
import { storiesOf } from '@storybook/react';

import { View } from './view.component';
import { withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  fetchUser: Function.prototype,
  removeUser: Function.prototype,
  removeUserFromProject: Function.prototype,
  userData: { id: '1' },
  history: {},
  intl: {
    formatMessage: ({ defaultMessage }) => defaultMessage,
  },
  isAdmin: true,
  match: { params: { userId: '1' } },
};

storiesOf('View', module)
  .addDecorator(withTheme())
  .add('Default', () => <View {...defaultProps} />);
