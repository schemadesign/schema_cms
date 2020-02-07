import React from 'react';
import { storiesOf } from '@storybook/react';

import { CheckboxOffIcon } from './checkboxOffIcon.component';
import { withTheme } from '../../../.storybook/decorators';

const defaultProps = { customStyles: { stroke: 'blue' } };

storiesOf('Icons/CheckboxOffIcon', module)
  .addDecorator(withTheme())
  .add('Default', () => <CheckboxOffIcon />)
  .add('with custom styles', () => <CheckboxOffIcon {...defaultProps} />);
