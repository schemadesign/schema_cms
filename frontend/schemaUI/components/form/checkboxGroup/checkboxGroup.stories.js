import React from 'react';
import { storiesOf } from '@storybook/react';

import { CheckboxGroup } from './checkboxGroup.component';

const defaultProps = {};

storiesOf('CheckboxGroup', module).add('Default', () => <CheckboxGroup {...defaultProps} />);
