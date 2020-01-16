import React from 'react';
import { storiesOf } from '@storybook/react';

import { ROLES } from '../../../modules/userProfile/userProfile.constants';
import { withTheme } from '../../../.storybook/decorators';
import { UserList } from './userList.component';

const { ADMIN, EDITOR } = ROLES;

export const defaultProps = {
  userRole: ROLES.ADMIN,
  fetchUsers: Function.prototype,
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
    { id: '1', firstName: 'Alan', lastName: 'Watts', role: ADMIN },
    { id: '2', firstName: 'Dale', lastName: 'Chihuly', role: EDITOR },
    { id: '3', firstName: 'Dave', lastName: 'Bowie', role: ADMIN },
  ],
};

storiesOf('Project|UserList', module)
  .addDecorator(withTheme())
  .add('No data', () => <UserList {...defaultProps} />)
  .add('List', () => <UserList {...propsWithUsers} />);
