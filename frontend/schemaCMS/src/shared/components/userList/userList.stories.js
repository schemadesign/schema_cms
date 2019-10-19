import React from 'react';
import { storiesOf } from '@storybook/react';

import { UserList } from './userList.component';

export const defaultProps = {
  users: [],
};

export const propsWithUsers = {
  users: [
    { id: 1, firstName: 'Alan', lastName: 'Watts' },
    { id: 2, firstName: 'Dale', lastName: 'Chihuly' },
    { id: 3, firstName: 'Dave', lastName: 'Bowie' },
  ],
};

storiesOf('UserList', module).add('Default', () => <UserList {...defaultProps} />);
storiesOf('UserList', module).add('With users', () => <UserList {...propsWithUsers} />);
