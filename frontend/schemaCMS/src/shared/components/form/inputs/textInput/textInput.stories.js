import React from 'react';
import { storiesOf } from '@storybook/react';

import { TextInput } from './textInput.component';

const defaultProps = {};

storiesOf('TextInput', module).add('Default', () => <TextInput {...defaultProps} />);
