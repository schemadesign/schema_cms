import React from 'react';
import { storiesOf } from '@storybook/react';

import { DataSourceNavigation } from './dataSourceNavigation.component';

const defaultProps = {};

storiesOf('DataSourceNavigation', module).add('Default', () => <DataSourceNavigation {...defaultProps} />);
