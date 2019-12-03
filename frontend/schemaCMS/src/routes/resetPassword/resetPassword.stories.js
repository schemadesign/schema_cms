import React from 'react';
import { storiesOf } from '@storybook/react';

import { ResetPassword } from './resetPassword.component';
import { withTheme } from '../../.storybook/decorators';
import { history } from '../../.storybook/helpers';
import { AUTH_METHODS } from '../../modules/userProfile/userProfile.constants';

export const defaultProps = {
  resetPassword: Function.prototype,
  userData: {
    authMethod: AUTH_METHODS.EMAIL,
  },
  history,
};

storiesOf('ResetPassword', module)
  .addDecorator(withTheme())
  .add('Default', () => <ResetPassword {...defaultProps} />);
