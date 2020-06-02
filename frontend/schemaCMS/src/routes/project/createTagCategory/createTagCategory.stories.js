import React from 'react';
import { storiesOf } from '@storybook/react';

import { CreateTagCategory } from './createTagCategory.component';
import { intl, history } from '../../../.storybook/helpers';
import { withTheme } from '../../../.storybook/decorators';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';
import { project } from '../../../modules/project/project.mocks';

export const defaultProps = {
  userRole: ROLES.ADMIN,
  isSubmitting: false,
  dirty: false,
  isValid: true,
  handleSubmit: Function.prototype,
  createTagCategory: Function.prototype,
  handleChange: Function.prototype,
  setFieldValue: Function.prototype,
  values: {
    name: '',
    tags: [],
  },
  project,
  match: {
    params: {
      projectId: 'projectId',
    },
  },
  history,
  intl,
};

storiesOf('Project|CreateTagCategory', module)
  .addDecorator(withTheme())
  .add('Default', () => <CreateTagCategory {...defaultProps} />);
