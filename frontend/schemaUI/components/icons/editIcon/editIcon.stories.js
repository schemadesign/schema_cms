import React from 'react';
import { storiesOf } from '@storybook/react';

import { EditIcon } from './editIcon.component';
import { withTheme } from '../../../.storybook/decorators';

const customStyles = { customStyles: { fill: 'blue' } };

storiesOf('Icons/EditIcon', module)
  .addDecorator(withTheme())
  .add('Default', () => <EditIcon />)
  .add('with custom styles', () => <EditIcon {...customStyles} />);
