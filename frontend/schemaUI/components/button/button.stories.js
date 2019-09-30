import React from 'react';
import { storiesOf } from '@storybook/react';

import { Button } from './button.component';
import { MenuIcon } from '../icons/menuIcon';
import { withTheme } from '../../.storybook/decorators';
import { Theme } from '../../utils/theme';

const customStyles = {
  backgroundColor: '#000',
  color: '#FFF',
  width: '150px',
};

const customStylesForIcon = {
  backgroundColor: '#dbdbdb',
  fontSize: 0,
};

storiesOf('Button/Dark theme', module)
  .addDecorator(withTheme())
  .add('Default', () => <Button>Next</Button>)
  .add('Inverse', () => <Button inverse>Next</Button>);

storiesOf('Button/Light theme', module)
  .addDecorator(withTheme(Theme.light))
  .add('Default', () => <Button>Next</Button>)
  .add('Inverse', () => <Button inverse>Next</Button>);

storiesOf('Button', module)
  .add('with custom styles', () => <Button customStyles={customStyles}>Next</Button>)
  .add('with icon', () => (
    <Button customStyles={customStylesForIcon}>
      <MenuIcon />
    </Button>
  ));



