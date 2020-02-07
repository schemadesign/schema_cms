import React from 'react';
import { storiesOf } from '@storybook/react';

import { ArrowLeftIcon } from './arrowLeftIcon.component';
import { withTheme } from '../../../.storybook/decorators';

storiesOf('Icons/ArrowLeftIcon', module).add('Default', () => <ArrowLeftIcon />);

const defaultProps = { customStyles: { fill: 'blue' } };
storiesOf('Icons/ArrowLeftIcon', module)
  .addDecorator(withTheme())
  .add('with custom styles', () => <ArrowLeftIcon {...defaultProps} />);
