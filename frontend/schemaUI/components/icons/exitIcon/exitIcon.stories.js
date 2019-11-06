import React from 'react';
import { storiesOf } from '@storybook/react';

import { withTheme } from '../../../.storybook/decorators';
import { ExitIcon } from './exitIcon.component';

const defaultProps = { customStyles: { fill: 'orange' } };

storiesOf('Icons/ExitIcon', module)
  .addDecorator(withTheme())
  .add('Default', () => <ExitIcon />)
  .add('with custom styles', () => <ExitIcon {...defaultProps} />);
