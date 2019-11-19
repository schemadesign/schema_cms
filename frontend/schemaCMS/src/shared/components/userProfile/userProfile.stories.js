import React from 'react';
import { storiesOf } from '@storybook/react';

import { UserProfile } from './userProfile.component';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';
import { withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  values: { firstName: 'firstName', lastName: 'lastName', email: 'email', role: ROLES.EDITOR },
  isCurrentUser: false,
  handleChange: Function.prototype,
};

export const currentUserProps = {
  ...defaultProps,
  isCurrentUser: true,
};

storiesOf('Shared Components|UserProfile', module)
  .addDecorator(withTheme())
  .add('Default', () => <UserProfile {...defaultProps} />)
  .add('User profile', () => <UserProfile {...currentUserProps} />);
