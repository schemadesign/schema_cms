import React from 'react';
import { storiesOf } from '@storybook/react';

import { withTheme } from '../../../.storybook/decorators';
import { history } from '../../../.storybook/helpers';
import { AddUser } from './addUser.component';

export const defaultProps = {
  fetchUsers: Function.prototype,
  removeUser: Function.prototype,
  fetchProjectEditors: Function.prototype,
  users: [],
  usersInProject: [],
  isAdmin: true,
  history,
  match: {
    params: {
      projectId: '1',
    },
  },
};

const email = 'loremipsumdolorsitametconsecteturadipiscinglitdonecobortis@nisitnullalobortisiaculis.com';

export const propsWithUsers = {
  ...defaultProps,
  users: [
    { id: 1, firstName: 'Alan', lastName: 'Watts' },
    { id: 2, firstName: 'Dale', lastName: 'Chihuly', email },
    { id: 3, firstName: 'Dave', lastName: 'Bowie' },
    {
      id: 4,
      firstName: 'Pellentesque a massa at purus cursus egestas. Aliquam ut vehicula.',
      lastName: 'Praesent est erat, laoreet et ornare ullamcorper, finibus id nisl. Etiam tempor, ligula a sagittis',
      email,
    },
  ],
  usersInProject: [{ id: 1, firstName: 'Alan', lastName: 'Watts' }],
};

storiesOf('Project|AddUser', module)
  .addDecorator(withTheme())
  .add('No data', () => <AddUser {...defaultProps} />)
  .add('List', () => <AddUser {...propsWithUsers} />);
