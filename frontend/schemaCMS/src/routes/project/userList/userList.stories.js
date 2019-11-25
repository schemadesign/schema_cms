import React from 'react';
import { storiesOf } from '@storybook/react';

import { withRouter, withTheme } from '../../../.storybook/decorators';
import { UserList } from './userList.component';

export const defaultProps = {
  clearProject: Function.prototype,
  fetchProject: Function.prototype,
  removeUser: Function.prototype,
  isAdmin: true,
  users: [],
  match: {
    params: {
      projectId: '1',
    },
  },
};

export const propsWithUsers = {
  ...defaultProps,
  users: [
    { id: '1', firstName: 'Alan', lastName: 'Watts' },
    { id: '2', firstName: 'Dale', lastName: 'Chihuly' },
    { id: '3', firstName: 'Dave', lastName: 'Bowie' },
  ],
};

storiesOf('Project|UserList', module)
  .addDecorator(withRouter)
  .addDecorator(withTheme())
  .add('list', () => <UserList {...defaultProps} />)
  .add('list with users', () => <UserList {...propsWithUsers} />);
