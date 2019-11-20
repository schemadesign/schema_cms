import React from 'react';
import { storiesOf } from '@storybook/react';

import { ResetPassword } from './resetPassword.component';
import { withTheme } from '../../.storybook/decorators';

const defaultProps = {
  resetPassword: Function.prototype,
};

storiesOf('ResetPassword', module)
  .addDecorator(withTheme())
  .add('Default', () => <ResetPassword {...defaultProps} />);
