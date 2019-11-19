import React from 'react';
import { storiesOf } from '@storybook/react';

import { RadioBaseComponent } from './radioBase.component';
import RadioGroupContext from '../../radioGroup/radioGroup.context';
import { withTheme } from '../../../../.storybook/decorators';

const defaultProps = {
  label: 'label',
  value: 'radio 1',
};

const context = {
  name: 'name',
};

const decorator = story => <RadioGroupContext.Provider value={context}>{story()}</RadioGroupContext.Provider>;

storiesOf('Form/RadioButton', module)
  .addDecorator(withTheme())
  .addDecorator(decorator)
  .add('Default', () => <RadioBaseComponent {...defaultProps}>name</RadioBaseComponent>);
