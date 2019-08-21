import React from 'react';
import { storiesOf } from '@storybook/react';

import { Menu } from './menu.component';

const defaultProps = {
  open: true,
};

storiesOf('Menu', module).add('Default', () => <Menu {...defaultProps}>items</Menu>);

storiesOf('Menu', module).add('Closed menu', () => <Menu open={false}>items</Menu>);

const customStyles = {
  backgroundColor: 'black',
  color: 'white',
};

const customCloseIconStyles = {
  fill: 'white',
};

storiesOf('Menu', module).add('With custom styles', () => (
  <Menu {...defaultProps} customStyles={customStyles} customCloseIconStyles={customCloseIconStyles}>
    items
  </Menu>
));
