import React from 'react';
import { storiesOf } from '@storybook/react';

import { CreateBlockTemplate } from './createBlockTemplate.component';

const defaultProps = {};

storiesOf('CreateBlockTemplate', module).add('Default', () => <CreateBlockTemplate {...defaultProps} />);
