import React from 'react';
import { storiesOf } from '@storybook/react';

import { View } from './view.component';

export const defaultProps = {
  dataSource: {
    project: '1',
    metaData: {},
  },
  dataWranglingScripts: [],
  fetchFields: Function.prototype,
  unmountFields: Function.prototype,
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
      dataSourceId: '1',
      step: '1',
    },
  },
};

storiesOf('DataSource/View', module).add('Default', () => <View {...defaultProps} />);
