import React from 'react';
import { storiesOf } from '@storybook/react';

import { MinusIcon } from './minusIcon.component';
import { withTheme } from '../../../.storybook/decorators';

storiesOf('Icons/MinusIcon', module).add('Default', () => <MinusIcon />);

const defaultProps = { customStyles: { fill: 'blue' } };
storiesOf('Icons/MinusIcon', module)
  .addDecorator(withTheme())
  .add('with custom styles', () => <MinusIcon {...defaultProps} />);
