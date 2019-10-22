import React from 'react';
import { storiesOf } from '@storybook/react';
import { UserCreateCMS } from './userCreateCMS.component';

export const userCreateCMSProps = {
  createUserCMS: Function.prototype,
  handleChange: Function.prototype,
  setFieldValue: Function.prototype,
  values: {},
};

storiesOf('UserCreate', module).add('Default', () => <UserCreateCMS {...userCreateCMSProps} />);
