import React from 'react';
import { storiesOf } from '@storybook/react';

import { TextField } from './textField.component';

const withLabel = {
  name: 'input',
  label: 'Label',
};

storiesOf('TextField', module).add('Default', () => <TextField {...withLabel} />);

const withoutLabel = {
  name: 'input',
};

storiesOf('TextField', module).add('Without label', () => <TextField {...withoutLabel} />);

const withError = {
  name: 'input',
  label: 'Label',
  error: true,
  defaultValue: 'value',
};

storiesOf('TextField', module).add('With error', () => <TextField {...withError} />);

const withMultiline = {
  name: 'input',
  label: 'Label',
  multiline: true,
  defaultValue:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
};

storiesOf('TextField', module).add('With multiline', () => <TextField {...withMultiline} />);
