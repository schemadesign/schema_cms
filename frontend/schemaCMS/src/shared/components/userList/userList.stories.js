import React from 'react';
import { storiesOf } from '@storybook/react';

import { UserList } from './userList.component';
import { withTheme } from '../../../.storybook/decorators';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';

const { ADMIN, EDITOR } = ROLES;

export const defaultProps = {
  users: [],
};

export const propsWithUsers = {
  users: [
    { id: 1, firstName: 'Alan', lastName: 'Watts', role: ADMIN },
    { id: 2, firstName: 'Dale', lastName: 'Chihuly', role: EDITOR },
    { id: 3, firstName: 'Dave', lastName: 'Bowie', role: ADMIN },
  ],
};

export const propsWithUsersAsAdmin = {
  ...propsWithUsers,
  isAdmin: true,
};

storiesOf('Shared Components|UserList', module)
  .addDecorator(withTheme())
  .add('default (empty)', () => <UserList {...defaultProps} />)
  .add('with users', () => <UserList {...propsWithUsers} />)
  .add('with users (as admin)', () => <UserList {...propsWithUsersAsAdmin} />);
