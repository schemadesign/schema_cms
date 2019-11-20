import React from 'react';
import { storiesOf } from '@storybook/react';

import { UserList } from './userList.component';
import { withRouter, withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  users: [],
  isAdmin: true,
};

const email = 'loremipsumdolorsitametconsecteturadipiscinglitdonecobortis@nisitnullalobortisiaculis.com';

export const propsWithUsers = {
  users: [
    { id: 1, firstName: 'Alan', lastName: 'Watts' },
    { id: 2, firstName: 'Dale', lastName: 'Chihuly' },
    { id: 3, firstName: 'Dave', lastName: 'Bowie', email },
  ],
  isAdmin: true,
};

export const propsWithUsersAndActions = {
  ...propsWithUsers,
  onRemoveUser: Function.prototype,
};

storiesOf('Shared Components|UserList', module)
  .addDecorator(withRouter)
  .addDecorator(withTheme())
  .add('default (empty)', () => <UserList {...defaultProps} />)
  .add('with users', () => <UserList {...propsWithUsers} />)
  .add('with users and actions', () => <UserList {...propsWithUsersAndActions} />);
