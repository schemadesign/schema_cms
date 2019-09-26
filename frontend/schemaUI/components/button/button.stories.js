import React from 'react';
import { storiesOf } from '@storybook/react';

import { Button } from './button.component';
import { MenuIcon } from '../icons/menuIcon';

const customStyles = {
  backgroundColor: '#000',
  color: '#FFF',
  width: '150px',
};

const customStylesForIcon = {
  backgroundColor: '#dbdbdb',
  fontSize: 0,
};

storiesOf('Button', module)
  .add('Default', () => <Button>Next</Button>)
  .add('Inverse', () => <Button inverse>Next</Button>)
  .add('with custom styles', () => <Button customStyles={customStyles}>Next</Button>)
  .add('with icon', () => (
    <Button customStyles={customStylesForIcon}>
      <MenuIcon />
    </Button>
  ));
