import React from 'react';
import { storiesOf } from '@storybook/react';

import DataSource from './dataSource.component';
import { withRouter, withTheme } from '../../.storybook/decorators';

export const defaultProps = {
  dataSource: {
    id: '1',
  },
  fetchDataSource: Function.prototype,
  unmountDataSource: Function.prototype,
  match: {
    params: {
      dataSourceId: '1',
    },
    path: 'path',
  },
};

storiesOf('Data Source|DataSource', module)
  .addDecorator(withRouter)
  .addDecorator(withTheme())
  .add('Default', () => <DataSource {...defaultProps} />);
