import React from 'react';
import { storiesOf } from '@storybook/react';

import { Checkbox } from './checkbox.component';
import CheckboxGroupContext from '../checkboxGroup/checkboxGroup.context';
import { CheckboxOnIcon } from '../../icons/checkboxOnIcon';
import { CheckboxOffIcon } from '../../icons/checkboxOffIcon';
import { dark } from '../../../utils/theme';
import { ThemeProvider } from '../../styles/themeProvider';

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
  .add('Default', () => (
    <ThemeProvider theme={dark}>
      <Checkbox {...defaultProps}>checkbox</Checkbox>
    </ThemeProvider>
  ))
  .add('Checked', () => (
    <ThemeProvider theme={dark}>
      <Checkbox {...checkedProps}>checkbox</Checkbox>
    </ThemeProvider>
  ));
