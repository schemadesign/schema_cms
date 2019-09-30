import React from 'react';
import { storiesOf } from '@storybook/react';

import { RadioButtonComponent } from './radioButton.component';
import RadioGroupContext from '../radioGroup/radioGroup.context';

const defaultProps = {
  label: 'label',
};

const context = {
  name: 'name',
};

const decorator = story => <RadioGroupContext.Provider value={context}>{story()}</RadioGroupContext.Provider>;

storiesOf('Form/RadioButton', module)
  .addDecorator(decorator)
  .add('Default', () => <RadioButtonComponent {...defaultProps}>name</RadioButtonComponent>);
