import React from 'react';
import { storiesOf } from '@storybook/react';

import { withTheme } from '../../../../.storybook/decorators';
import { UserCreate } from './userCreate.component';

export const defaultProps = {
  handleSubmit: Function.prototype,
  handleChange: Function.prototype,
  handleBlur: Function.prototype,
  setFieldValue: Function.prototype,
  onCancelClick: Function.prototype,
  isValid: true,
  isSubmitting: false,
  values: {},
  intl: {
    formatMessage: ({ defaultMessage }) => defaultMessage,
  },
};

storiesOf('Shared Components|UserCreate/UserCreate', module)
  .addDecorator(withTheme())
  .add('Default', () => <UserCreate {...defaultProps} />);
