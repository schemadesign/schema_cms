import React from 'react';
import { storiesOf } from '@storybook/react';

import { withTheme } from '../../../../.storybook/decorators';
import { intl } from '../../../../.storybook/helpers';
import { UserCreateProject } from './userCreateProject.component';

export const userCreateProjectProps = {
  createUserProject: Function.prototype,
  user: {},
  project: {},
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
      projectId: 1,
    },
  },
};

storiesOf('Shared Components|UserCreate/UserCreateProject', module)
  .addDecorator(withTheme())
  .add('Default', () => <UserCreateProject {...userCreateProjectProps} />);
