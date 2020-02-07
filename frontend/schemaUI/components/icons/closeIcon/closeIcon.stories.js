import React from 'react';
import { storiesOf } from '@storybook/react';

import { CloseIcon } from './closeIcon.component';
import { withTheme } from '../../../.storybook/decorators';

storiesOf('Icons/CloseIcon', module).add('Default', () => <CloseIcon />);

const defaultProps = { customStyles: { fill: 'blue' } };
storiesOf('Icons/CloseIcon', module)
  .addDecorator(withTheme())
  .add('with custom styles', () => <CloseIcon {...defaultProps} />);
