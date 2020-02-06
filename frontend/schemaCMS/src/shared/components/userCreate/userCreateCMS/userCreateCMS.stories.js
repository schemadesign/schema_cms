import React from 'react';
import { storiesOf } from '@storybook/react';

import { withTheme } from '../../../../.storybook/decorators';
import { intl } from '../../../../.storybook/helpers';
import { UserCreateCMS } from './userCreateCMS.component';
import { ROLES } from '../../../../modules/userProfile/userProfile.constants';

export const userCreateCMSProps = {
  userRole: ROLES.ADMIN,
  createUserCMS: Function.prototype,
  handleChange: Function.prototype,
  setFieldValue: Function.prototype,
  values: {},
  intl,
};

storiesOf('Shared Components|UserCreate/UserCreateCMS', module)
  .addDecorator(withTheme())
  .add('Default', () => <UserCreateCMS {...userCreateCMSProps} />);
