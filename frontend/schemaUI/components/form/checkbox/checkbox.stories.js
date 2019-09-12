import React from 'react';
import { storiesOf } from '@storybook/react';

import { Checkbox } from './checkbox.component';

const defaultProps = {};

storiesOf('Checkbox', module).add('Default', () => <Checkbox {...defaultProps} />);
