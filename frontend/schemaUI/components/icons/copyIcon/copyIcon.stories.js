import React from 'react';
import { storiesOf } from '@storybook/react';

import { CopyIcon } from './copyIcon.component';
import { withTheme } from '../../../.storybook/decorators';

const defaultProps = { customStyles: { fill: 'blue' } };
storiesOf('Icons/CopyIcon', module)
  .addDecorator(withTheme())
  .add('Default', () => <CopyIcon />)
  .add('with custom styles', () => <CopyIcon {...defaultProps} />);
