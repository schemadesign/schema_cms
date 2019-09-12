import React from 'react';
import { storiesOf } from '@storybook/react';

import { Checkbox } from './checkbox.component';
import CheckboxGroupContext from '../checkboxGroup/checkboxGroup.context';

export const defaultProps = {
  value: 'value',
  label: 'name',
  id: 'id',
};

export const context = {
  name: 'name',
  onChange: () => {},
  value: ['value'],
};

const decorator = story => <CheckboxGroupContext.Provider value={context}>{story()}</CheckboxGroupContext.Provider>;

storiesOf('Form/Checkbox', module)
  .addDecorator(decorator)
  .add('Default', () => <Checkbox {...defaultProps} />);
