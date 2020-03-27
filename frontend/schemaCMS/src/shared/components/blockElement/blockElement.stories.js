import React from 'react';
import { storiesOf } from '@storybook/react';

import { BlockElement } from './blockElement.component';

export const defaultProps = {};

storiesOf('BlockElement', module).add('Default', () => <BlockElement {...defaultProps} />);
