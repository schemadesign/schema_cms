import React from 'react';
import { storiesOf } from '@storybook/react';

import { BinIcon } from './binIcon.component';
import { withTheme } from '../../../.storybook/decorators';

const customStyles = { customStyles: { fill: 'blue' } };

storiesOf('Icons/BinIcon', module)
  .addDecorator(withTheme())
  .add('Default', () => <BinIcon />)
  .add('with custom styles', () => <BinIcon {...customStyles} />);
