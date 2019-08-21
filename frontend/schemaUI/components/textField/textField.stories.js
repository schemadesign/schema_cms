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

storiesOf('TextField', module).add('Without error', () => <TextField {...withError} />);
