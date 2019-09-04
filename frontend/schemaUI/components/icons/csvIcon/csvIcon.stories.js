import React from 'react';
import { storiesOf } from '@storybook/react';

import { CsvIcon } from './csvIcon.component';

const customStyles = { customStyles: { fill: 'blue' } };

storiesOf('Icons/CsvIcon', module)
  .add('Default', () => <CsvIcon />)
  .add('with custom styles', () => <CsvIcon {...customStyles} />);
