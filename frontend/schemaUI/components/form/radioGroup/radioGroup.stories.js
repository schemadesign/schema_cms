import React from 'react';
import { storiesOf } from '@storybook/react';

import { RadioGroup } from './radioGroup.component';
import { RadioButton } from '../radioButton/radioButton.component';
import { PlusIcon } from '../../icons/plusIcon';

const defaultProps = {
  name: 'name',
  value: 'radio 1',
  customStyles: {
    flexDirection: 'row',
  },
  customLabelStyles: {
    opacity: 0.1,
  },
  customCheckedStyles: {
    opacity: 1,
  },
};

storiesOf('Form/RadioGroup', module).add('Default', () => (
  <RadioGroup {...defaultProps}>
    <RadioButton label="radio 1" value="radio 1">
      <PlusIcon />
    </RadioButton>
    <RadioButton label="radio 2" value="radio 2">
      <PlusIcon />
    </RadioButton>
  </RadioGroup>
));
