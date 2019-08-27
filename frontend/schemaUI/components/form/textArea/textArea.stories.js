import React from 'react';
import { storiesOf } from '@storybook/react';

import { TextArea } from './textArea.component';

const defaultProps = {
  defaultValue: 'Text area',
};
const withCustomStyles = {
  defaultValue: 'Text area',
  customStyles: {
    color: 'blue',
  },
};

storiesOf('Form/TextArea', module)
  .add('Default', () => <TextArea {...defaultProps} />)
  .add('With custom styles', () => <TextArea {...withCustomStyles} />);
