import React from 'react';
import { storiesOf } from '@storybook/react';

import { MenuIcon } from './menuIcon.component';

const defaultProps = {};

storiesOf('MenuIcon', module).add('Default', () => <MenuIcon {...defaultProps} />);
