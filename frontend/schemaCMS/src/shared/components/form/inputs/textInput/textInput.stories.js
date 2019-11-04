import React from 'react';
import { storiesOf } from '@storybook/react';

import { withTheme } from '../../../../../.storybook/decorators';
import { TextInput } from './textInput.component';

const defaultProps = {
  touched: {},
  errors: {},
  label: 'Field',
  value: 'Value',
  name: 'A_FIELD_NAME',
  onChange: Function.prototype,
};

const withError = {
  ...defaultProps,
  touched: {
    [defaultProps.name]: true,
  },
  errors: {
    [defaultProps.name]: 'error',
  },
};

const withEditIcon = {
  ...defaultProps,
  isEdit: true,
};

storiesOf('Shared Components|Form/TextInput', module)
  .addDecorator(withTheme())
  .add('Default', () => <TextInput {...defaultProps} />)
  .add('With error', () => <TextInput {...withError} />)
  .add('With edit icon', () => <TextInput {...withEditIcon} />);
