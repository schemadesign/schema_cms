import React from 'react';
import { storiesOf } from '@storybook/react';

import { MenuIcon } from './menuIcon.component';

storiesOf('MenuIcon', module).add('Default', () => <MenuIcon />);

const defaultProps = { customStyles: { fill: 'blue' } };
storiesOf('MenuIcon', module).add('with custom styles', () => <MenuIcon {...defaultProps} />);
