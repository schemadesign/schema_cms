import React from 'react';
import { storiesOf } from '@storybook/react';

import { Source } from './source.component';

const defaultProps = {};

storiesOf('Source', module).add('Default', () => <Source {...defaultProps} />);
