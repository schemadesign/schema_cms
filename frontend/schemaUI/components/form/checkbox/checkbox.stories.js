import React from 'react';
import { storiesOf } from '@storybook/react';

import { Checkbox } from './checkbox.component';
import CheckboxGroupContext from '../checkboxGroup/checkboxGroup.context';
import { CheckboxOnIcon } from '../../icons/checkboxOnIcon';
import { CheckboxOffIcon } from '../../icons/checkboxOffIcon';
import { withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  value: 'value 2',
  isEdit: true,
  id: 'id',
};

export const checkedProps = {
  ...defaultProps,
  value: 'value',
};

export const context = {
  name: 'name',
  onChange: () => {},
  value: ['value'],
  checkedIcon: <CheckboxOnIcon />,
  uncCheckedIcon: <CheckboxOffIcon />,
};

const decorator = story => <CheckboxGroupContext.Provider value={context}>{story()}</CheckboxGroupContext.Provider>;

storiesOf('Form/Checkbox', module)
  .addDecorator(decorator)
  .addDecorator(withTheme())
  .add('Default', () => <Checkbox {...defaultProps}>checkbox</Checkbox>)
  .add('Checked', () => <Checkbox {...checkedProps}>checkbox</Checkbox>);
