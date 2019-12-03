import React from 'react';
import { storiesOf } from '@storybook/react';

import { UserProfile } from './userProfile.component';
import { userData } from '../../../modules/userProfile/userProfile.mock';
import { withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  values: userData,
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
