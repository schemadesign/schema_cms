import React from 'react';
import { storiesOf } from '@storybook/react';

import { CheckboxGroup } from './checkboxGroup.component';
import { Checkbox } from '../checkbox/checkbox.component';

export const defaultProps = {
  name: 'name',
  value: ['checkbox 1'],
  isEdit: true,
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
  <Checkbox label="checkbox 1" value="checkbox 1" id="checkbox 1" key="1" />,
  <Checkbox label="checkbox 2" value="checkbox 2" id="checkbox 2" key="2" />,
];

storiesOf('Form/CheckboxGroup', module).add('Default', () => (
  <CheckboxGroup {...defaultProps}>{children}</CheckboxGroup>
));
