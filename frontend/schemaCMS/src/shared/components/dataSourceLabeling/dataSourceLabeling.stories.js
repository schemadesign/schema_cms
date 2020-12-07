import React from 'react';
import { storiesOf } from '@storybook/react';

import { DataSourceLabeling } from './dataSourceLabeling.component';

export const defaultProps = {};

storiesOf('DataSourceLabeling', module).add('Default', () => <DataSourceLabeling {...defaultProps} />);
