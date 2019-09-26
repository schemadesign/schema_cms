import React from 'react';
import { storiesOf } from '@storybook/react';

import { View } from './view.component';

export const defaultProps = {
  dataSource: {},
  dataWranglingScripts: [],
  fetchDataSource: Function.prototype,
  unmountDataSource: Function.prototype,
  removeDataSource: Function.prototype,
  updateDataSource: Function.prototype,
  fetchDataWranglingScripts: Function.prototype,
  uploadScript: Function.prototype,
  sendUpdatedDataWranglingScript: Function.prototype,
  intl: {
    formatMessage: ({ defaultMessage }) => defaultMessage,
  },
  history: {
    push: Function.prototype,
  },
  match: {
    params: {
      projectId: '1',
      dataSourceId: '1',
      step: '1',
    },
    url: '/project/view/1/datasource/view/1/1',
  },
};

storiesOf('DataSource/View', module).add('Default', () => <View {...defaultProps} />);
