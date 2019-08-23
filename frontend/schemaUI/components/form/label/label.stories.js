import React from 'react';
import { storiesOf } from '@storybook/react';

import { Label } from './label.component';

const defaultProps = {
  label: 'Label',
};
const withCustomStyles = {
  label: 'Label',
  customStyles: {
    color: 'blue',
  },
};

storiesOf('Form/Label', module)
  .add('Default', () => <Label {...defaultProps} />)
  .add('With custom styles', () => <Label {...withCustomStyles} />);
