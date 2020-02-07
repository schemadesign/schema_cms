import React from 'react';
import { storiesOf } from '@storybook/react';

import { CheckboxOnIcon } from './checkboxOnIcon.component';
import { withTheme } from '../../../.storybook/decorators';

const defaultProps = { customStyles: { stroke: 'green' } };

storiesOf('Icons/CheckboxOnIcon', module)
  .addDecorator(withTheme())
  .add('Default', () => <CheckboxOnIcon />)
  .add('with custom styles', () => <CheckboxOnIcon {...defaultProps} />);
