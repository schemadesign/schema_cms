import React from 'react';
import { storiesOf } from '@storybook/react';

import { ROLES } from '../../../modules/userProfile/userProfile.constants';
import { withTheme } from '../../../.storybook/decorators';
import { List } from './list.component';

const { ADMIN, EDITOR } = ROLES;

export const noDataProps = {
  fetchUsers: Function.prototype,
  users: [],
  isAdmin: true,
};

export const defaultProps = {
  fetchUsers: Function.prototype,
  isAdmin: true,
  users: [
    { id: '1', firstName: 'Alan', lastName: 'Watts', role: EDITOR },
    { id: '2', firstName: 'Dale', lastName: 'Chihuly', role: ADMIN },
    { id: '3', firstName: 'Dave', lastName: 'Bowie', role: EDITOR },
  ],
};

storiesOf('User|List', module)
  .addDecorator(withTheme())
  .add('No data', () => <List {...noDataProps} />)
  .add('List', () => <List {...defaultProps} />);
