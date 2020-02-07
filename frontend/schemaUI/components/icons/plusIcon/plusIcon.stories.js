import React from 'react';
import { storiesOf } from '@storybook/react';

import { PlusIcon } from './plusIcon.component';
import { withTheme } from '../../../.storybook/decorators';

storiesOf('Icons/PlusIcon', module).add('Default', () => <PlusIcon />);

const defaultProps = { customStyles: { fill: 'blue' } };
storiesOf('Icons/PlusIcon', module)
  .addDecorator(withTheme())
  .add('with custom styles', () => <PlusIcon {...defaultProps} />);
