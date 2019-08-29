import React from 'react';
import { storiesOf } from '@storybook/react';

import { DataSource } from './dataSource.component';

const defaultProps = {};

storiesOf('DataSource', module).add('Default', () => <DataSource {...defaultProps} />);
