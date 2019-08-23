import React from 'react';
import { storiesOf } from '@storybook/react';

import { EditIcon } from './editIcon.component';

const customStyles = { customStyles: { fill: 'blue' } };

storiesOf('Icons/EditIcon', module)
  .add('Default', () => <EditIcon />)
  .add('with custom styles', () => <EditIcon {...customStyles} />);
