import React from 'react';
import { storiesOf } from '@storybook/react';

import { UserCreate } from './userCreate.component';

export const defaultProps = {
  handleSubmit: Function.prototype,
  handleChange: Function.prototype,
  setFieldValue: Function.prototype,
  values: {},
};

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

export const userCreateCMSProps = {
  createUserCMS: Function.prototype,
  handleChange: Function.prototype,
  setFieldValue: Function.prototype,
  values: {},
};

storiesOf('UserCreate', module).add('Default', () => <UserCreate {...defaultProps} />);
