import React from 'react';
import { storiesOf } from '@storybook/react';

import { ResultIcon } from './resultIcon.component';
import { withTheme } from '../../../.storybook/decorators';

const defaultProps = { customStyles: { fill: 'blue' } };

storiesOf('Icons/ResultIcon', module)
  .addDecorator(withTheme())
  .add('Default', () => <ResultIcon />)
  .add('with custom styles', () => <ResultIcon {...defaultProps} />);
