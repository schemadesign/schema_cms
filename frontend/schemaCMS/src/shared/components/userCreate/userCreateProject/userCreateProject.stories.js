import React from 'react';
import { storiesOf } from '@storybook/react';

import { UserCreateProject } from './userCreateProject';

export const userCreateProjectProps = {
  createUserProject: Function.prototype,
  user: {},
  project: {},
  isFetched: false,
  fetchProject: Function.prototype,
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

storiesOf('UserCreateProject', module).add('Default', () => <UserCreateProject {...userCreateProjectProps} />);
