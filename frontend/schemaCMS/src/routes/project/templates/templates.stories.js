import React from 'react';
import { storiesOf } from '@storybook/react';

import { Templates } from './templates.component';

const defaultProps = {};

storiesOf('Templates', module).add('Default', () => <Templates {...defaultProps} />);
