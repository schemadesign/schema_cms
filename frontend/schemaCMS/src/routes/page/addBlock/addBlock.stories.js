import React from 'react';
import { storiesOf } from '@storybook/react';

import { AddBlock } from './addBlock.component';

export const defaultProps = {};

storiesOf('AddBlock', module).add('Default', () => <AddBlock {...defaultProps} />);
