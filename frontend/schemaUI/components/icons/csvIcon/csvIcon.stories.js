import React from 'react';
import { storiesOf } from '@storybook/react';

import { CsvIcon } from './csvIcon.component';
import { withTheme } from '../../../.storybook/decorators';

const customStyles = { customStyles: { fill: 'blue' } };

storiesOf('Icons/CsvIcon', module)
  .addDecorator(withTheme())
  .add('Default', () => <CsvIcon />)
  .add('with custom styles', () => <CsvIcon {...customStyles} />);
