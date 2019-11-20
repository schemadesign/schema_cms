import React from 'react';
import { storiesOf } from '@storybook/react';

import { View } from './view.component';
import { withTheme } from '../../../.storybook/decorators';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';

export const defaultProps = {
  fetchUser: Function.prototype,
  removeUser: Function.prototype,
  makeAdmin: Function.prototype,
  userData: {},
  isAdmin: false,
  history: {
    push: Function.prototype,
  },
  match: { params: { userId: '1' } },
};

export const adminProps = {
  ...defaultProps,
  userData: {
    role: ROLES.EDITOR,
  },
  isAdmin: true,
};

storiesOf('User View', module)
  .addDecorator(withTheme())
  .add('Default', () => <View {...defaultProps} />)
  .add('Admin', () => <View {...adminProps} />);
