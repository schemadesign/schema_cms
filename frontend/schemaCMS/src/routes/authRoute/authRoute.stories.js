import React from 'react';
import { storiesOf } from '@storybook/react';

import { AuthRoute } from './authRoute.component';
import { withTheme } from '../../.storybook/decorators';

const defaultProps = {
  fetchCurrentUser: () => {},
};

storiesOf('AuthRoute', module)
  .addDecorator(withTheme())
  .add('Default', () => <AuthRoute {...defaultProps} />);
