import React from 'react';
import { storiesOf } from '@storybook/react';

import { withTheme } from '../../../../.storybook/decorators';
import { UserCreate } from './userCreate.component';

export const defaultProps = {
  handleSubmit: Function.prototype,
  handleChange: Function.prototype,
  setFieldValue: Function.prototype,
  onCancelClick: Function.prototype,
  values: {},
};

storiesOf('Shared Components|UserCreate/UserCreate', module)
  .addDecorator(withTheme())
  .add('Default', () => <UserCreate {...defaultProps} />);
