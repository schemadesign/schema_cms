import React from 'react';
import { storiesOf } from '@storybook/react';

import { withTheme } from '../../../../.storybook/decorators';
import { UserCreateCMS } from './userCreateCMS.component';

export const userCreateCMSProps = {
  createUserCMS: Function.prototype,
  handleChange: Function.prototype,
  setFieldValue: Function.prototype,
  values: {},
};

storiesOf('Shared Components|UserCreate/UserCreateCMS', module)
  .addDecorator(withTheme())
  .add('Default', () => <UserCreateCMS {...userCreateCMSProps} />);
