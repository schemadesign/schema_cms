import React from 'react';
import { storiesOf } from '@storybook/react';

import { Metadata } from './metadata.component';

export const defaultProps = {};

storiesOf('Metadata', module).add('Default', () => <Metadata {...defaultProps} />);
