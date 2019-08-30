import React from 'react';
import { storiesOf } from '@storybook/react';

import { FileUpload } from './fileUpload.component';

const defaultProps = {
  name: 'name',
  label: 'label',
};

storiesOf('Form/FileUpload', module).add('Default', () => <FileUpload {...defaultProps} />);
