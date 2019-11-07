import React from 'react';
import { storiesOf } from '@storybook/react';

import DataSource from './dataSource.component';
import { withRouter } from '../../.storybook/decorators';

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

storiesOf('DataSource', module)
  .addDecorator(withRouter)
  .add('Default', () => <DataSource {...defaultProps} />);
