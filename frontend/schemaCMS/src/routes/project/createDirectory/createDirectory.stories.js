import React from 'react';
import { storiesOf } from '@storybook/react';

import { CreateDirectory } from './createDirectory.component';

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
};

storiesOf('CreateDirectory', module).add('Default', () => <CreateDirectory {...defaultProps} />);
