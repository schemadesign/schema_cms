import React from 'react';
import { storiesOf } from '@storybook/react';

import { Loader } from './loader.component';

export const defaultProps = {};

storiesOf('Loader', module).add('Default', () => <Loader {...defaultProps} />);
