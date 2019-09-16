import React from 'react';
import { storiesOf } from '@storybook/react';

import { CheckboxOnIcon } from './checkboxOnIcon.component';

const defaultProps = { customStyles: { stroke: 'green' } };

storiesOf('Icons/CheckboxOnIcon', module)
  .add('Default', () => <CheckboxOnIcon />)
  .add('with custom styles', () => <CheckboxOnIcon {...defaultProps} />);
