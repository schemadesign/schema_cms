import React from 'react';
import { storiesOf } from '@storybook/react';

import { UserProfile } from './userProfile.component';
import { INITIAL_VALUES, ROLES } from '../../../modules/userProfile/userProfile.constants';
import { withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  userData: { ...INITIAL_VALUES, role: ROLES.EDITOR, id: '1' },
  updateMe: Function.prototype,
  makeAdmin: Function.prototype,
  removeUser: Function.prototype,
  removeUserFromProject: Function.prototype,
  isSettings: false,
  isAdmin: true,
  isCurrentUser: false,
  match: { params: { userId: '1' } },
  history: {
    push: Function.prototype,
  },
  intl: {
    formatMessage: ({ defaultMessage }) => defaultMessage,
  },
};

export const userMe = {
  ...defaultProps,
  isCurrentUser: true,
  match: { params: { userId: 'me' } },
};

export const projectUser = {
  ...defaultProps,
  match: { params: { userId: '1', projectId: '1' } },
};

storiesOf('Shared Components|UserProfile', module)
  .addDecorator(withTheme())
  .add('Default', () => <UserProfile {...defaultProps} />)
  .add('User profile', () => <UserProfile {...userMe} />)
  .add('Project user', () => <UserProfile {...projectUser} />);
