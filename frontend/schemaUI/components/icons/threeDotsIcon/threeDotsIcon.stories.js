import React from 'react';
import { storiesOf } from '@storybook/react';

import { ThreeDotsIcon } from './threeDotsIcon.component';
import { withTheme } from '../../../.storybook/decorators';

storiesOf('Icons/ThreeDotsIcon', module).add('Default', () => <ThreeDotsIcon />);

const defaultProps = { customStyles: { fill: 'blue' } };
storiesOf('Icons/ThreeDotsIcon', module)
  .addDecorator(withTheme())
  .add('with custom styles', () => <ThreeDotsIcon {...defaultProps} />);
