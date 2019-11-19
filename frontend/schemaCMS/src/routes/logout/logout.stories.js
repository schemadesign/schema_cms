import React from 'react';
import { storiesOf } from '@storybook/react';

import { Logout } from './logout.component';
import { withTheme } from '../../.storybook/decorators';

const defaultProps = {
  logout: Function.prototype,
};

storiesOf('Logout', module)
  .addDecorator(withTheme())
  .add('Default', () => <Logout {...defaultProps} />);
