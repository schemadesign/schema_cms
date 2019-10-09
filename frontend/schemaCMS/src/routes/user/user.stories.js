import React from 'react';
import { storiesOf } from '@storybook/react';

import { User } from './user.component';

const defaultProps = {};

storiesOf('User', module).add('Default', () => <User {...defaultProps} />);
