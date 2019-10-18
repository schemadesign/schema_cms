import React from 'react';
import { storiesOf } from '@storybook/react';

import { Settings } from './settings.component';

const defaultProps = {};

storiesOf('Settings', module).add('Default', () => <Settings {...defaultProps} />);
