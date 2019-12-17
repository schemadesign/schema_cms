import React from 'react';
import { storiesOf } from '@storybook/react';

import { Draggable } from './draggable.component';

const defaultProps = {};

storiesOf('Draggable', module).add('Default', () => <Draggable {...defaultProps} />);
