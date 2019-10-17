import React from 'react';
import { storiesOf } from '@storybook/react';

import { AddUser } from './addUser.component';

const defaultProps = {};

storiesOf('AddUser', module).add('Default', () => <AddUser {...defaultProps} />);
