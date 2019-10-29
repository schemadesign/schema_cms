import React from 'react';
import { storiesOf } from '@storybook/react';

import { TextInput } from './textInput.component';
import { withTheme } from '../../../../../.storybook/decorators';

const defaultProps = {
  touched: {},
  errors: {},
  label: 'Field',
  value: 'Value',
  name: 'A_FIELD_NAME',
  onChange: Function.prototype,
};

const withEditIcon = {
  ...defaultProps,
  isEdit: true,
};

storiesOf('Shared Components|Form/TextInput', module)
  .addDecorator(withTheme())
  .add('Default', () => <TextInput {...defaultProps} />)
  .add('With edit icon', () => <TextInput {...withEditIcon} />);
