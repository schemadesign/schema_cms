import React from 'react';
import { storiesOf } from '@storybook/react';

import { withRouter, withTheme } from '../../../.storybook/decorators';
import { DataSourceList } from './dataSourceList.component';
import { jobs } from '../../../modules/dataSource/jobs.mock';

const dataSource = {
  created: '2019-09-09T11:23:40+0000',
  createdBy: { firstName: 'firstName', lastName: 'lastName' },
  id: 17,
  metaData: null,
  activeJob: null,
  name: 'name',
};

const dataSourceWithFakeJob = {
  ...dataSource,
  metaData: {
    fields: 11,
    items: 246,
  },
  activeJob: {
    scripts: [],
  },
};

const dataSourceWithJob = {
  ...dataSourceWithFakeJob,
  activeJob: {
    scripts: [1],
  },
};

const withJob = {
  ...dataSource,
  jobs,
};

export const defaultProps = {
  createDataSource: Function.prototype,
  fetchDataSources: Function.prototype,
  cancelFetchListLoop: Function.prototype,
  history: {
    push: Function.prototype,
  },
  dataSources: [],
  match: {
    params: {
      projectId: '1',
    },
  },
  intl: {
    formatMessage: ({ defaultMessage }) => defaultMessage,
  },
};

export const propsWithDataSource = {
  ...defaultProps,
  dataSources: [dataSource, dataSourceWithFakeJob, dataSourceWithJob],
};

export const propsWithJob = {
  ...defaultProps,
  dataSources: [withJob],
};

storiesOf('Project|DataSourceList', module)
  .addDecorator(withRouter)
  .addDecorator(withTheme())
  .add('Empty', () => <DataSourceList {...defaultProps} />)
  .add('With data source', () => <DataSourceList {...propsWithDataSource} />)
  .add('With jobs', () => <DataSourceList {...propsWithJob} />);
