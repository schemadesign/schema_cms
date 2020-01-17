import React from 'react';
import { storiesOf } from '@storybook/react';

import { withTheme } from '../../../../.storybook/decorators';
import { intl } from '../../../../.storybook/helpers';
import { UserCreateProject } from './userCreateProject.component';
import { ROLES } from '../../../../modules/userProfile/userProfile.constants';

export const userCreateProjectProps = {
  userRole: ROLES.ADMIN,
  createUserProject: Function.prototype,
  user: {
    id: '1',
    firstName: 'Ann',
    lastName: 'Lorem',
  },
  project: {
    id: '1',
    title: 'Ipsum Project',
  },
  isFetched: false,
  fetchProject: Function.prototype,
  fetchUser: Function.prototype,
  clearUser: Function.prototype,
  clearProject: Function.prototype,
  handleChange: Function.prototype,
  setFieldValue: Function.prototype,
  values: {},
  intl,
  match: {
    params: {
      projectId: '1',
      userId: '1',
    },
  },
};

storiesOf('Shared Components|UserCreate/UserCreateProject', module)
  .addDecorator(withTheme())
  .add('Default', () => <UserCreateProject {...userCreateProjectProps} />);
