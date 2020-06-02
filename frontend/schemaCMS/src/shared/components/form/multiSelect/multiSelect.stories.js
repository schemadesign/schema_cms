import React from 'react';
import { storiesOf } from '@storybook/react';

import { MultiSelect } from './multiSelect.component';

export const defaultProps = {
  options: [{ label: 'car', value: 'car' }, { label: 'animal', value: 'animal' }],
  value: [{ label: 'car', value: 'car' }],
  onChange: Function.prototype,
};

storiesOf('Shared Components|Form/MultiSelect', module).add('Default', () => <MultiSelect {...defaultProps} />);
