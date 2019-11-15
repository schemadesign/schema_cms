import React from 'react';
import { storiesOf } from '@storybook/react';

import { View } from './view.component';

export const defaultProps = {
  fetchUser: Function.prototype,
  removeUser: Function.prototype,
  updateMe: Function.prototype,
  removeUserFromProject: Function.prototype,
  currentUser: {},
  history: {},
  intl: {
    formatMessage: ({ defaultMessage }) => defaultMessage,
  },
  user: {},
  isAdmin: true,
  match: { params: { userId: '1' } },
};

storiesOf('View', module).add('Default', () => <View {...defaultProps} />);
