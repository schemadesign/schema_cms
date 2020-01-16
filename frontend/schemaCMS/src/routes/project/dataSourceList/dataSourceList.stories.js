import React from 'react';
import { storiesOf } from '@storybook/react';
import { Theme } from 'schemaUI';

import { withTheme } from '../../../.storybook/decorators';
import { history, intl } from '../../../.storybook/helpers';
import { DataSourceList } from './dataSourceList.component';
import { dataSources } from '../../../modules/dataSource/dataSource.mock';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';

export const defaultProps = {
  userRole: ROLES.ADMIN,
  createDataSource: Function.prototype,
  fetchDataSources: Function.prototype,
  cancelFetchListLoop: Function.prototype,
  dataSources: [],
  history,
  intl,
  theme: {
    card: Theme.dark.card,
  },
  match: {
    params: {
      projectId: '1',
    },
    url: 'url',
  },
};

export const propsWithDataSources = {
  ...defaultProps,
  dataSources,
};

storiesOf('Project|DataSourceList', module)
  .addDecorator(withTheme())
  .add('Empty', () => <DataSourceList {...defaultProps} />)
  .add('With data source', () => <DataSourceList {...propsWithDataSources} />);
