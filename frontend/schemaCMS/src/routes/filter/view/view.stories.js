import React from 'react';
import { storiesOf } from '@storybook/react';

import { View } from './view.component';

const defaultProps = {};

storiesOf('View', module).add('Default', () => <View {...defaultProps} />);
