import React from 'react';
import { storiesOf } from '@storybook/react';

import { DataSourceLabeling } from './dataSourceLabeling.component';

export const defaultProps = {
  dataSource: {
    fields: {
      Field1: {
        dtype: 'string',
      },
      Field2: {
        dtype: 'Number',
      },
    },
  },
  onSelect: () => {},
};

storiesOf('DataSourceLabeling', module).add('Default', () => <DataSourceLabeling {...defaultProps} />);
