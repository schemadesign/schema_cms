import React from 'react';
import { storiesOf } from '@storybook/react';

import { EyeIcon } from './eyeIcon.component';
import { withTheme } from '../../../.storybook/decorators';

storiesOf('Icons/EyeIcon', module).add('Default', () => <EyeIcon />);

const defaultProps = { customStyles: { stroke: 'blue' } };
storiesOf('Icons/EyeIcon', module)
  .addDecorator(withTheme())
  .add('with custom styles', () => <EyeIcon {...defaultProps} />);
