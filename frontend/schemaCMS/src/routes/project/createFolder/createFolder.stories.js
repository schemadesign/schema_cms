import React from 'react';
import { storiesOf } from '@storybook/react';

import { CreateFolder } from './createFolder.component';

export const defaultProps = {
  intl: { formatMessage: ({ defaultMessage }) => defaultMessage },
  values: {},
  history: {
    push: Function.prototype,
  },
  match: {
    params: {
      projectId: '1',
    },
  },
  handleSubmit: Function.prototype,
  handleChange: Function.prototype,
  handleBlur: Function.prototype,
  isValid: true,
  isSubmitting: false,
};

storiesOf('Project|CreateFolder', module).add('Default', () => <CreateFolder {...defaultProps} />);
