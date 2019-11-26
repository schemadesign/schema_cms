import React from 'react';
import { storiesOf } from '@storybook/react';

import { CreateBlock } from './createBlock.component';

const defaultProps = {};

storiesOf('CreateBlock', module).add('Default', () => <CreateBlock {...defaultProps} />);
