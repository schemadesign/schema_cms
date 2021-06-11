import React from 'react';
import { storiesOf } from '@storybook/react';

import { ApiIcon } from './apiIcon.component';
import { withTheme } from '../../../.storybook/decorators';

const defaultProps = { customStyles: { stroke: 'blue' } };

storiesOf('Icons/ApiIcon', module)
  .addDecorator(withTheme())
  .add('Default', () => <ApiIcon />)
  .add('with custom styles', () => <ApiIcon {...defaultProps} />);
