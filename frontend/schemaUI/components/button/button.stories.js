import React from 'react';
import { storiesOf } from '@storybook/react';

import { Button } from './button.component';
import { MenuIcon } from '../icons/menuIcon';

const styles = {
  backgroundColor: '#000',
  color: '#FFF',
  padding: '20px',
};

storiesOf('Button', module)
  .add('Default', () => <Button customStyles={styles}>button</Button>)
  .add('with icon', () => (
    <Button customStyles={styles}>
      <MenuIcon />
    </Button>
  ));
