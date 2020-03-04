import React from 'react';
import { storiesOf } from '@storybook/react';

import { BlockElementTemplate } from './blockElementTemplate.component';

export const defaultProps = {};

storiesOf('BlockElementTemplate', module).add('Default', () => <BlockElementTemplate {...defaultProps} />);
