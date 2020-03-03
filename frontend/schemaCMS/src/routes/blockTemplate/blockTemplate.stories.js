import React from 'react';
import { storiesOf } from '@storybook/react';

import { BlockTemplate } from './blockTemplate.component';

export const defaultProps = {};

storiesOf('BlockTemplate', module).add('Default', () => <BlockTemplate {...defaultProps} />);
