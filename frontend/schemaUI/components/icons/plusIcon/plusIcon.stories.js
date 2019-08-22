import React from 'react';
import { storiesOf } from '@storybook/react';

import { PlusIcon } from './plusIcon.component';

storiesOf('Icons/PlusIcon', module).add('Default', () => <PlusIcon />);

const defaultProps = { customStyles: { fill: 'blue' } };
storiesOf('Icons/PlusIcon', module).add('with custom styles', () => <PlusIcon {...defaultProps} />);
