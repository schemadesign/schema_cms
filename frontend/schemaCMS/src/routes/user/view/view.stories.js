import React from 'react';
import { storiesOf } from '@storybook/react';

import { View } from './view.component';
import { withTheme } from '../../../.storybook/decorators';
import { history } from '../../../.storybook/helpers';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';

export const defaultProps = {
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
  userData: {
    id: '1',
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'email@example.com',
    role: ROLES.EDITOR,
  },
};

export const adminProps = {
  ...defaultProps,
  userData: {
    ...editorProps.userData,
  },
  isAdmin: true,
};

storiesOf('User/View', module)
  .addDecorator(withTheme())
  .add('Editor', () => <View {...editorProps} />)
  .add('Admin', () => <View {...adminProps} />);
