import React from 'react';
import { storiesOf } from '@storybook/react';

import { UserList } from './userList.component';

const defaultProps = {};

storiesOf('UserList', module).add('Default', () => <UserList {...defaultProps} />);
