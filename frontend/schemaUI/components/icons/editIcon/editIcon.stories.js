import React from 'react';
import { storiesOf } from '@storybook/react';

import { EditIcon } from './editIcon.component';

storiesOf('EditIcon', module).add('Default', () => <EditIcon />);

const defaultProps = { customStyles: { fill: 'blue' } };
storiesOf('EditIcon', module).add('with custom styles', () => <EditIcon {...defaultProps} />);
