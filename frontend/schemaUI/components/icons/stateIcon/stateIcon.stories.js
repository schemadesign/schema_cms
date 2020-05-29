import React from 'react';
import { storiesOf } from '@storybook/react';

import { StateIcon } from './stateIcon.component';
import { withTheme } from '../../../.storybook/decorators';

const customStyles = { customStyles: { stroke: 'blue' } };

storiesOf('Icons/StateIcon', module)
  .addDecorator(withTheme())
  .add('Default', () => <StateIcon />)
  .add('with custom styles', () => <StateIcon {...customStyles} />);
