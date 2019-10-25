import React from 'react';
import { storiesOf } from '@storybook/react';

import { withTheme } from '../../../../.storybook/decorators';
import { UserCreateProject } from './userCreateProject';

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
  match: {
    params: {
      projectId: 1,
    },
  },
};

storiesOf('Shared Components|UserCreate/UserCreateProject', module)
  .addDecorator(withTheme())
  .add('Default', () => <UserCreateProject {...userCreateProjectProps} />);
