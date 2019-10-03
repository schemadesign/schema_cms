import React from 'react';
import { storiesOf } from '@storybook/react';

import { withRouter, withTheme } from '../../../.storybook/decorators';
import { DataSourceList } from './dataSourceList.component';
import { jobs } from '../../../modules/dataSource/jobs.mock';
import {
  STATUS_DONE,
  STATUS_DRAFT,
  STATUS_ERROR,
  STATUS_PROCESSING,
  STATUS_READY_FOR_PROCESSING,
} from '../../../modules/dataSource/dataSource.constants';

const dataSource = {
  created: '2019-09-09T11:23:40+0000',
  createdBy: { firstName: 'firstName', lastName: 'lastName' },
  id: 17,
  metaData: {
    fields: 11,
    items: 246,
  },
  name: 'name',
  status: STATUS_DONE,
};

const dataSource2 = {
  created: '2019-09-10T11:23:40+0000',
  createdBy: { firstName: 'firstName', lastName: 'lastName' },
  id: 17,
  metaData: {
    fields: 11,
    items: 246,
  },
  name: 'name',
  status: STATUS_DONE,
};

const withJob = {
  ...dataSource,
  jobs,
};

const withError = {
  ...dataSource,
  status: STATUS_ERROR,
  errorLog: ['error 1', 'error2'],
};

const withProcessing = {
  ...dataSource,
  status: STATUS_PROCESSING,
};

const withReadyForProcessing = {
  ...dataSource,
  status: STATUS_READY_FOR_PROCESSING,
};

const withDraft = {
  ...dataSource,
  status: STATUS_DRAFT,
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
  dataSources: [dataSource, dataSource2],
};

export const propsWithJob = {
  ...defaultProps,
  dataSources: [withJob],
};

export const propsWithError = {
  ...defaultProps,
  dataSources: [withError],
};

export const propsWithProcessing = {
  ...defaultProps,
  dataSources: [withProcessing],
};

export const propsWithReadyForProcessing = {
  ...defaultProps,
  dataSources: [withReadyForProcessing],
};

export const propsWithDraft = {
  ...defaultProps,
  dataSources: [withDraft],
};

storiesOf('DataSourceList', module)
  .addDecorator(withRouter)
  .addDecorator(withTheme())
  .add('Empty', () => <DataSourceList {...defaultProps} />)
  .add('With data source', () => <DataSourceList {...propsWithDataSource} />)
  .add('With job', () => <DataSourceList {...propsWithJob} />)
  .add('With error', () => <DataSourceList {...propsWithError} />)
  .add('With processing', () => <DataSourceList {...propsWithProcessing} />)
  .add('With ready for processing', () => <DataSourceList {...propsWithReadyForProcessing} />)
  .add('With draft', () => <DataSourceList {...propsWithDraft} />);
