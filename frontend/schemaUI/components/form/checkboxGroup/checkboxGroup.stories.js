import React from 'react';
import { storiesOf } from '@storybook/react';

import { CheckboxGroup } from './checkboxGroup.component';
import { Checkbox } from '../checkbox/checkbox.component';

export const defaultProps = {
  name: 'name',
  value: ['checkbox 1'],
  customStyles: {
    width: '320px',
  },
  customLabelStyles: {
    opacity: 0.1,
  },
  customCheckedStyles: {
    opacity: 1,
  },
  onChange: Function.prototype,
};

export const children = [
  <Checkbox value="checkbox 1" id="checkbox 1" key="1">
    checkbox 1
  </Checkbox>,
  <Checkbox value="checkbox 2" id="checkbox 2" key="2" isEdit>
    checkbox 2
  </Checkbox>,
];

storiesOf('Form/CheckboxGroup', module).add('Default', () => (
  <CheckboxGroup {...defaultProps}>{children}</CheckboxGroup>
));
