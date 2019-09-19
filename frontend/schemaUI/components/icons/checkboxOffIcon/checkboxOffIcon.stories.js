import React from 'react';
import { storiesOf } from '@storybook/react';

import { CheckboxOffIcon } from './checkboxOffIcon.component';

const defaultProps = { customStyles: { stroke: 'blue' } };

storiesOf('Icons/CheckboxOffIcon', module)
  .add('Default', () => <CheckboxOffIcon />)
  .add('with custom styles', () => <CheckboxOffIcon {...defaultProps} />);
