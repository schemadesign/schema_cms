import React from 'react';
import { storiesOf } from '@storybook/react';

import { BlockTemplates } from './blockTemplates.component';

const defaultProps = {};

storiesOf('BlockTemplates', module).add('Default', () => <BlockTemplates {...defaultProps} />);
