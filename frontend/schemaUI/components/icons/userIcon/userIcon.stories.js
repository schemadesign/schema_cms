import React from 'react';
import { storiesOf } from '@storybook/react';

import { withTheme } from '../../../.storybook/decorators';
import { UserIcon } from './userIcon.component';

const defaultProps = { customStyles: { fill: 'orange' } };

storiesOf('Icons/UserIcon', module)
  .addDecorator(withTheme())
  .add('Default', () => <UserIcon />)
  .add('with custom styles', () => <UserIcon {...defaultProps} />);
