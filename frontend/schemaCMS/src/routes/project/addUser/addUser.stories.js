import React from 'react';
import { storiesOf } from '@storybook/react';

import { AddUser } from './addUser.component';

export const defaultProps = {
  match: {
    params: {
      projectId: '1',
    },
  },
  fetchUsers: Function.prototype,
  removeUser: Function.prototype,
  fetchProject: Function.prototype,
  users: [],
  usersInProject: [],
};

export const propsWithUsers = {
  ...defaultProps,
  users: [
    { id: 1, firstName: 'Alan', lastName: 'Watts' },
    { id: 2, firstName: 'Dale', lastName: 'Chihuly' },
    { id: 3, firstName: 'Dave', lastName: 'Bowie' },
  ],
  usersInProject: [{ id: 1, firstName: 'Alan', lastName: 'Watts' }],
};

storiesOf('AddUser', module).add('Default', () => <AddUser {...defaultProps} />);
storiesOf('AddUser', module).add('With users', () => <AddUser {...propsWithUsers} />);
