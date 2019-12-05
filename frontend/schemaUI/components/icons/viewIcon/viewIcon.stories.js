import React from 'react';
import { storiesOf } from '@storybook/react';

import { ViewIcon } from './viewIcon.component';
import { withTheme } from '../../../.storybook/decorators';

const defaultProps = { customStyles: { stroke: 'blue' } };

storiesOf('Icons/ViewIcon', module)
  .addDecorator(withTheme())
  .add('Default', () => <ViewIcon />)
  .add('with custom styles', () => <ViewIcon {...defaultProps} />);
