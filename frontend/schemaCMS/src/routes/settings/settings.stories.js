import React from 'react';
import { storiesOf } from '@storybook/react';

import { Settings } from './settings.component';
import { withTheme } from '../../.storybook/decorators';
import { AUTH_METHODS } from '../../modules/userProfile/userProfile.constants';

export const defaultProps = {
  updateMe: Function.prototype,
  userData: {
    authMethod: AUTH_METHODS.EMAIL,
  },
  history: { push: Function.prototype, goBack: Function.prototype },
};

storiesOf('Settings', module)
  .addDecorator(withTheme())
  .add('Default', () => <Settings {...defaultProps} />);
