import React from 'react';
import { storiesOf } from '@storybook/react';

import { UserCreate } from './userCreate.component';

export const defaultProps = {
  handleSubmit: Function.prototype,
  handleChange: Function.prototype,
  setFieldValue: Function.prototype,
  onCancelClick: Function.prototype,
  values: {},
};

storiesOf('UserCreate', module).add('Default', () => <UserCreate {...defaultProps} />);
