import React from 'react';
import { storiesOf } from '@storybook/react';

import { Button } from './button.component';
import { MenuIcon } from '../icons/menuIcon';
import { withTheme } from '../../.storybook/decorators';
import { Theme } from '../../utils/theme';

const baseCustomStyles = {
  width: '150px',
  margin: '15px',
};

const customStyles = {
  ...baseCustomStyles,
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
  .add('Default', () => <Button>Default</Button>)
  .add('Inverse', () => <Button inverse>Inverse</Button>)
  .add('Disabled', () => (
    <div>
      <Button disabled customStyles={baseCustomStyles}>
        Previous
      </Button>
      <Button inverse disabled customStyles={baseCustomStyles}>
        Next
      </Button>
    </div>
  ));

storiesOf('Button/Light theme', module)
  .addDecorator(withTheme(Theme.light))
  .add('Default', () => <Button>Default</Button>)
  .add('Inverse', () => <Button inverse>Inverse</Button>)
  .add('Disabled', () => (
    <div>
      <Button disabled customStyles={baseCustomStyles}>
        Previous
      </Button>
      <Button inverse disabled customStyles={baseCustomStyles}>
        Next
      </Button>
    </div>
  ));

storiesOf('Button', module)
  .add('with custom styles', () => <Button customStyles={customStyles}>Next</Button>)
  .add('with icon', () => (
    <Button customStyles={customStylesForIcon}>
      <MenuIcon />
    </Button>
  ));
