import React from 'react';
import { storiesOf } from '@storybook/react';

import { List } from './list.component';

const defaultProps = {};

storiesOf('List', module).add('Default', () => <List {...defaultProps} />);
