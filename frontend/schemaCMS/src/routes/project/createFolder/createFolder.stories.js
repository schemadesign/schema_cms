import React from 'react';
import { storiesOf } from '@storybook/react';

import { withTheme } from '../../../.storybook/decorators';
import { history, intl } from '../../../.storybook/helpers';
import { CreateFolder } from './createFolder.component';

export const defaultProps = {
  values: {},
  handleSubmit: Function.prototype,
  handleChange: Function.prototype,
  handleBlur: Function.prototype,
  isValid: true,
  isSubmitting: false,
  history,
  intl,
  match: {
    params: {
      projectId: '1',
    },
  },
};

storiesOf('Project|CreateFolder', module)
  .addDecorator(withTheme())
  .add('Default', () => <CreateFolder {...defaultProps} />);
