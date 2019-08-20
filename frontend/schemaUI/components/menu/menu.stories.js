import React from 'react';
import { storiesOf } from '@storybook/react';

import { Menu } from './menu.component';

const defaultProps = {
  open: true,
};

storiesOf('Menu', module).add('Default', () => <Menu {...defaultProps}>items</Menu>);
