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

const withFileNames = {
  id: 'id',
  label: 'label',
  multiple: true,
  fileNames: ['name 1.csv', 'name 2.csv'],
};

const withRemovePossibility = {
  id: 'id',
  label: 'label',
  multiple: true,
  onRemoveItem: Function.prototype,
  fileNames: ['name 1.csv', 'name 2.csv'],
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
  .add('with file names', () => <FileUpload {...withFileNames} />)
  .add('with remove possibility', () => <FileUpload {...withRemovePossibility} />)
  .add('with custom icon', () => <FileUpload {...withCustomIcon} />)
  .add('with custom styles', () => <FileUpload {...withCustomStyles} />);
