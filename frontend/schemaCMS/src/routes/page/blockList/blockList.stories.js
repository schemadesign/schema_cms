import React from 'react';
import { storiesOf } from '@storybook/react';

import { BlockList } from './blockList.component';

const defaultProps = {};

storiesOf('BlockList', module).add('Default', () => <BlockList {...defaultProps} />);
