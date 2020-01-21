import React from 'react';
import { storiesOf } from '@storybook/react';

import { Input } from './input.component';
import { withTheme } from '../../../.storybook/decorators';

const defaultProps = {
  defaultValue: 'value',
};
const withCustomStyles = {
  defaultValue: 'value',
  customStyles: {
    color: 'blue',
  },
};

storiesOf('Form/Input', module)
  .addDecorator(withTheme())
  .add('Default', () => <Input {...defaultProps} />)
  .add('With custom styles', () => <Input {...withCustomStyles} />);
