import React from 'react';
import { storiesOf } from '@storybook/react';

import { CaretIcon } from './caretIcon.component';
import { withTheme } from '../../../.storybook/decorators';

const customStyles = { customStyles: { fill: 'blue' } };

storiesOf('Icons/CaretIcon', module)
  .addDecorator(withTheme())
  .add('Default', () => <CaretIcon />)
  .add('with custom styles', () => <CaretIcon {...customStyles} />);
