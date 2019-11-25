import React from 'react';
import { storiesOf } from '@storybook/react';

import { CreateDirectory } from './createDirectory.component';

export const defaultProps = {
  intl: {
    formatMessage: Function.prototype,
  },
  values: {},
  history: {},
  handleSubmit: Function.prototype,
  handleChange: Function.prototype,
  handleBlur: Function.prototype,
};

storiesOf('CreateDirectory', module).add('Default', () => <CreateDirectory {...defaultProps} />);
