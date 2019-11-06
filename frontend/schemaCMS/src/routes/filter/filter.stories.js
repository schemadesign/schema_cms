import React from 'react';
import { storiesOf } from '@storybook/react';

import { Filter } from './filter.component';

const defaultProps = {};

storiesOf('Filter', module).add('Default', () => <Filter {...defaultProps} />);
