import React from 'react';
import { storiesOf } from '@storybook/react';

import { TextInput } from './textInput.component';

const defaultProps = {
  touched: {},
  errors: {},
  value: '',
  name: 'A_FIELD_NAME',
  onChange: Function.prototype,
};

storiesOf('TextInput', module).add('Default', () => <TextInput {...defaultProps} />);
