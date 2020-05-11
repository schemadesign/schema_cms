import React from 'react';
import { storiesOf } from '@storybook/react';

import { Create } from './create.component';
import { INITIAL_VALUES, PROJECT_STATUS, PROJECT_TITLE } from '../../../modules/project/project.constants';
import { withTheme } from '../../../.storybook/decorators';
import { history, intl } from '../../../.storybook/helpers';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';

export const defaultProps = {
  userRole: ROLES.ADMIN,
  values: {
    [PROJECT_TITLE]: 'title',
    [PROJECT_STATUS]: INITIAL_VALUES[PROJECT_STATUS],
  },
  handleChange: Function.prototype,
  handleSubmit: Function.prototype,
  handleBlur: Function.prototype,
  setFieldValue: Function.prototype,
  touched: {},
  errors: {},
  isAdmin: true,
  isValid: true,
  isSubmitting: false,
  history,
  intl,
  match: {
    params: {
      projectId: 'projectId',
    },
  },
};

storiesOf('Project|Create', module)
  .addDecorator(withTheme())
  .add('Default', () => <Create {...defaultProps} />);
