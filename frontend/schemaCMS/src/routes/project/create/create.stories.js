import React from 'react';
import { storiesOf } from '@storybook/react';

import { Create } from './create.component';
import { INITIAL_VALUES, PROJECT_STATUS, PROJECT_TITLE } from '../../../modules/project/project.constants';
import { withTheme } from '../../../.storybook/decorators';
import { history, intl } from '../../../.storybook/helpers';

export const defaultProps = {
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
};

storiesOf('Project|Create', module)
  .addDecorator(withTheme())
  .add('Default', () => <Create {...defaultProps} />);
