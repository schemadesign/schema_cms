import React from 'react';
import { storiesOf } from '@storybook/react';

import { Menu } from './menu.component';

const defaultProps = {
  open: true,
};

const customMenu = {
  ...defaultProps,
  customStyles: {
    backgroundColor: 'darkblue',
    color: 'white',
  },
  closeButtonProps: {
    customStyles: {
      backgroundColor: 'white',
      height: 60,
      top: 20,
      right: 20,
    },
    iconStyles: {
      fill: 'green'
    },
    id: 'special-close-button'
  }
};

storiesOf('Menu', module)
  .add('Default', () => <Menu {...defaultProps}>items</Menu>)
  .add('Closed menu', () => <Menu open={false}>items</Menu>)
  .add('With custom styles', () => (
    <Menu {...customMenu}>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
      </ul>
    </Menu>
  ));
