import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';

import { Input } from './input.component';
import { withTheme } from '../../../.storybook/decorators';

export const defaultProps = {};
export const withCustomStyles = {
  ...defaultProps,
  customStyles: {
    color: 'blue',
  },
};
export const withAutoWidth = {
  ...defaultProps,
  autoWidth: true,
};

const TestComponent = props => {
  const [value, setValue] = useState('');

  const handleChange = ({ target: { value } }) => setValue(value);

  return <Input {...props} value={value} onChange={handleChange} />;
};

storiesOf('Form/Input', module)
  .addDecorator(withTheme())
  .add('Default', () => <TestComponent {...defaultProps} />)
  .add('With auto width', () => <TestComponent {...withAutoWidth} />)
  .add('With custom styles', () => <TestComponent {...withCustomStyles} />);
