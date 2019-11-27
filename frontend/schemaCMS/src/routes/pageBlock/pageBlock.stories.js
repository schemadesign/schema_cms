import React from 'react';
import { storiesOf } from '@storybook/react';

import { PageBlock } from './pageBlock.component';

const defaultProps = {};

storiesOf('PageBlock', module).add('Default', () => <PageBlock {...defaultProps} />);
