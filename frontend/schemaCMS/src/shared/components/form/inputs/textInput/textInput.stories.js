import React from 'react';
import { storiesOf } from '@storybook/react';

import { TextInput } from './textInput.component';

const defaultProps = {
  touched: {},
  errors: {},
  label: 'Field',
  value: 'Value',
  name: 'A_FIELD_NAME',
  onChange: Function.prototype,
};

storiesOf('Shared Components|Form/TextInput', module).add('Default', () => <TextInput {...defaultProps} />);
