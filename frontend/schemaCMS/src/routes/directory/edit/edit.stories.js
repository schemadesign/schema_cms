import React from 'react';
import { storiesOf } from '@storybook/react';

import { Edit } from './edit.component';

const defaultProps = {};

storiesOf('Edit', module).add('Default', () => <Edit {...defaultProps} />);
