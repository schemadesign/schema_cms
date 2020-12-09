import React from 'react';
import { storiesOf } from '@storybook/react';

import { DataSourceLabeling } from './dataSourceLabeling.component';

export const defaultProps = {
  dataSource: {
    labels: {
      Field1: {
        type: 'string',
      },
      Field2: {
        type: 'number',
      },
    },
  },
  onSelect: () => {},
};

storiesOf('DataSourceLabeling', module).add('Default', () => <DataSourceLabeling {...defaultProps} />);
