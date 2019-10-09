import React from 'react';
import { storiesOf } from '@storybook/react';

import { UserCreate } from './userCreate.component';

const defaultProps = {};

storiesOf('UserCreate', module).add('Default', () => <UserCreate {...defaultProps} />);
