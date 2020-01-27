import React from 'react';
import { storiesOf } from '@storybook/react';

import { FileUpload } from './fileUpload.component';
import { withTheme } from '../../../.storybook/decorators';

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
  fileNames: ['name.csv'],
};

const disabled = {
  id: 'id',
  label: 'label',
  fileNames: ['name.csv'],
  disabled: true,
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
  .addDecorator(withTheme())
  .add('Default', () => <FileUpload {...defaultProps} />)
  .add('with label', () => <FileUpload {...withLabel} />)
  .add('with file name', () => <FileUpload {...withFileName} />)
  .add('disabled', () => <FileUpload {...disabled} />)
  .add('with custom icon', () => <FileUpload {...withCustomIcon} />)
  .add('with custom styles', () => <FileUpload {...withCustomStyles} />);
