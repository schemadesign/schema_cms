import React from 'react';
import { storiesOf } from '@storybook/react';

import { UserCreate } from './userCreate.component';

const defaultProps = {
  handleSubmit: Function.prototype,
};

storiesOf('UserCreate', module).add('Default', () => <UserCreate {...defaultProps} />);
