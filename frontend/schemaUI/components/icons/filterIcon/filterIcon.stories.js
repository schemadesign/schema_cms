import React from 'react';
import { storiesOf } from '@storybook/react';

import { FilterIcon } from './filterIcon.component';
import { withTheme } from '../../../.storybook/decorators';

const defaultProps = { customStyles: { stroke: 'blue' } };

storiesOf('Icons/FilterIcon', module)
  .addDecorator(withTheme())
  .add('Default', () => <FilterIcon />)
  .add('with custom styles', () => <FilterIcon {...defaultProps} />);
