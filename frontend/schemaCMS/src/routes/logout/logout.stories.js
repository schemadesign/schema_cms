import React from 'react';
import { storiesOf } from '@storybook/react';

import { Logout } from './logout.component';

const defaultProps = {
  logout: Function.prototype,
};

storiesOf('Logout', module).add('Default', () => <Logout {...defaultProps} />);
