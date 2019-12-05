import React from 'react';
import { storiesOf } from '@storybook/react';

import { DataSourceNavigation } from './dataSourceNavigation.component';
import { withTheme } from '../../../.storybook/decorators';
import { SOURCE_PAGE } from '../../../modules/dataSource/dataSource.constants';

export const defaultProps = {
  dataSource: {
    id: '1',
    activeJob: null,
  },
  history: {
    push: Function.prototype,
  },
  hideOnDesktop: false,
  match: {
    url: SOURCE_PAGE,
  },
};

export const propsWithFakeJob = {
  ...defaultProps,
  dataSource: {
    id: '1',
    activeJob: {
      scripts: [],
    },
  },
};

export const propsWithJob = {
  ...defaultProps,
  dataSource: {
    id: '1',
    activeJob: {
      scripts: [1],
    },
  },
};

storiesOf('Shared Components|DataSourceNavigation', module)
  .addDecorator(withTheme())
  .add('Default', () => <DataSourceNavigation {...defaultProps} />)
  .add('With fake Job', () => <DataSourceNavigation {...propsWithFakeJob} />)
  .add('With Job', () => <DataSourceNavigation {...propsWithJob} />);
