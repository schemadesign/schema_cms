import React from 'react';
import { storiesOf } from '@storybook/react';

import { FieldIcon } from './fieldIcon.component';
import { withTheme } from '../../../.storybook/decorators';

const defaultProps = { customStyles: { fill: 'blue' } };

storiesOf('Icons/FieldIcon', module)
  .addDecorator(withTheme())
  .add('Default', () => <FieldIcon />)
  .add('with custom styles', () => <FieldIcon {...defaultProps} />);
