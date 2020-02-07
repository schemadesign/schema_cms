import React from 'react';
import { storiesOf } from '@storybook/react';

import { MenuIcon } from './menuIcon.component';
import { withTheme } from '../../../.storybook/decorators';

storiesOf('Icons/MenuIcon', module).add('Default', () => <MenuIcon />);

const defaultProps = { customStyles: { fill: 'blue' } };
storiesOf('Icons/MenuIcon', module)
  .addDecorator(withTheme())
  .add('with custom styles', () => <MenuIcon {...defaultProps} />);
