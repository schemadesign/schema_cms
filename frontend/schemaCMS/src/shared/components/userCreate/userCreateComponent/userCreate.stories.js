import React from 'react';
import { storiesOf } from '@storybook/react';

import { withTheme } from '../../../../.storybook/decorators';
import { intl } from '../../../../.storybook/helpers';
import { UserCreate } from './userCreate.component';
import { ROLES } from '../../../../modules/userProfile/userProfile.constants';

export const defaultProps = {
  userRole: ROLES.ADMIN,
  handleSubmit: Function.prototype,
  handleChange: Function.prototype,
  handleBlur: Function.prototype,
  setFieldValue: Function.prototype,
  onCancelClick: Function.prototype,
  isValid: true,
  isSubmitting: false,
  values: {},
  intl,
};

storiesOf('Shared Components|UserCreate/UserCreate', module)
  .addDecorator(withTheme())
  .add('Default', () => <UserCreate {...defaultProps} />);
