import React from 'react';
import { storiesOf } from '@storybook/react';

import { HomeIcon } from './homeIcon.component';
import { withTheme } from '../../../.storybook/decorators';

const defaultProps = { customStyles: { fill: 'blue' } };

storiesOf('Icons/HomeIcon', module)
  .addDecorator(withTheme())
  .add('Default', () => <HomeIcon />)
  .add('With custom styles', () => <HomeIcon {...defaultProps} />);
