import React from 'react';
import { storiesOf } from '@storybook/react';

import DataSource from './dataSource.component';
import { withRouter, withTheme } from '../../.storybook/decorators';

export const defaultProps = {
  dataSource: {
    project: '2',
    activeJob: null,
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

export const propsWithActiveJob = {
  ...defaultProps,
  dataSource: {
    project: '2',
    activeJob: {
      id: 1,
      scripts: [1],
    },
  },
};

storiesOf('Data Source|DataSource', module)
  .addDecorator(withRouter)
  .addDecorator(withTheme())
  .add('Default', () => <DataSource {...defaultProps} />)
  .add('With active job', () => <DataSource {...propsWithActiveJob} />);
