import React from 'react';
import { storiesOf } from '@storybook/react';

import { withRouter, withTheme } from '../../../.storybook/decorators';
import { history, intl } from '../../../.storybook/helpers';
import { DataSourceList } from './dataSourceList.component';

const dataSource = {
  created: '2019-09-09T11:23:40+0000',
  createdBy: { firstName: 'firstName', lastName: 'lastName' },
  id: 17,
  metaData: null,
  name: 'name',
};

const dataSource2 = {
  created: '2019-09-10T11:23:40+0000',
  createdBy: { firstName: 'firstName', lastName: 'lastName' },
  id: 17,
  metaData: {
    fields: 11,
    items: 246,
  },
  name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
};

export const defaultProps = {
  createDataSource: Function.prototype,
  fetchDataSources: Function.prototype,
  cancelFetchListLoop: Function.prototype,
  dataSources: [],
  history,
  intl,
  match: {
    params: {
      projectId: '1',
    },
  },
};

export const propsWithDataSource = {
  ...defaultProps,
  dataSources: [dataSource, dataSource2],
};

storiesOf('Project|DataSourceList', module)
  .addDecorator(withRouter)
  .addDecorator(withTheme())
  .add('No data', () => <DataSourceList {...defaultProps} />)
  .add('List', () => <DataSourceList {...propsWithDataSource} />);
