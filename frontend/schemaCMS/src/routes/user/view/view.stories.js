import React from 'react';
import { storiesOf } from '@storybook/react';

import { View } from './view.component';

export const defaultProps = {
  fetchUser: Function.prototype,
  removeUser: Function.prototype,
  intl: {
    formatMessage: ({ defaultMessage }) => defaultMessage,
  },
  userData: {},
  match: { params: { userId: '1' } },
};

storiesOf('View', module).add('Default', () => <View {...defaultProps} />);
