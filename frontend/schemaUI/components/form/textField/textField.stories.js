import React from 'react';
import { storiesOf } from '@storybook/react';

import { TextField } from './textField.component';
import { EditIcon } from '../../icons/editIcon';

const withLabel = {
  name: 'textField',
  label: 'Label',
  defaultValue: 'Value',
};
const withoutLabel = {
  name: 'textField',
  defaultValue: 'Value',
};
const withFullWidth = {
  name: 'textField',
  fullWidth: true,
  label: 'Label',
  defaultValue: 'Value',
};
const withError = {
  name: 'textField',
  label: 'Label',
  error: true,
  defaultValue: 'Value',
};
const withMultiline = {
  name: 'textField',
  label: 'Label',
  multiline: true,
  defaultValue:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
};

const withIcon = {
  name: 'textField',
  iconComponent: <EditIcon />,
  defaultValue: 'Value',
};

storiesOf('Form/TextField', module)
  .add('Default', () => <TextField {...withLabel} />)
  .add('Without label', () => <TextField {...withoutLabel} />)
  .add('With full width', () => <TextField {...withFullWidth} />)
  .add('With error', () => <TextField {...withError} />)
  .add('With multiline', () => <TextField {...withMultiline} />)
  .add('With Icon', () => <TextField {...withIcon} />);
