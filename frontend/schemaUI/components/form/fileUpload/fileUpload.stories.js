import React from 'react';
import { storiesOf } from '@storybook/react';

import { FileUpload } from './fileUpload.component';

const defaultProps = {
  id: 'id',
};

const withLabel = {
  id: 'id',
  label: 'label',
};

const withFileName = {
  id: 'id',
  label: 'label',
  name: 'name.csv',
};

const withCustomIcon = {
  ...withFileName,
  iconComponent: <span>icon</span>,
};

const withCustomStyles = {
  ...withFileName,
  customStyles: {
    backgroundColor: 'red',
  },
  customLabelStyles: {
    backgroundColor: 'blue',
  },
  customInputStyles: {
    backgroundColor: 'green',
  },
};

storiesOf('Form/FileUpload', module)
  .add('Default', () => <FileUpload {...defaultProps} />)
  .add('with label', () => <FileUpload {...withLabel} />)
  .add('with file name', () => <FileUpload {...withFileName} />)
  .add('with custom icon', () => <FileUpload {...withCustomIcon} />)
  .add('with custom styles', () => <FileUpload {...withCustomStyles} />);
