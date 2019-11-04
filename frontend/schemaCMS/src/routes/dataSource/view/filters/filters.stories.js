import React from 'react';
import { storiesOf } from '@storybook/react';

import { Filters } from './filters.component';

const defaultProps = {};

storiesOf('Filters', module).add('Default', () => <Filters {...defaultProps} />);
