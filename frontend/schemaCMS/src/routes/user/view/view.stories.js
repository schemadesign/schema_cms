import React from 'react';
import { storiesOf } from '@storybook/react';

import { View } from './view.component';
import { withTheme } from '../../../.storybook/decorators';
import { history } from '../../../.storybook/helpers';
import { userData } from '../../../modules/userProfile/userProfile.mock';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';

export const defaultProps = {
  userRole: ROLES.ADMIN,
  fetchUser: Function.prototype,
  removeUser: Function.prototype,
  makeAdmin: Function.prototype,
  userData: {},
  isAdmin: false,
  history,
  match: { params: { userId: '1' } },
};

export const editorProps = {
  ...defaultProps,
  userData,
};

export const makeAdminProps = {
  ...editorProps,
  isAdmin: true,
};

export const adminProps = {
  ...defaultProps,
  userData: {
    ...userData,
    role: ROLES.ADMIN,
  },
  isAdmin: true,
};

storiesOf('User|View', module)
  .addDecorator(withTheme())
  .add('Editor', () => <View {...editorProps} />)
  .add('Make Admin', () => <View {...makeAdminProps} />)
  .add('Admin', () => <View {...adminProps} />);
