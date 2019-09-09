import React from 'react';
import { storiesOf } from '@storybook/react';

import { Logout } from './logout.component';

const defaultProps = {};

storiesOf('Logout', module).add('Default', () => <Logout {...defaultProps} />);
