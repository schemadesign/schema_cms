import React from 'react';
import { storiesOf } from '@storybook/react';

import { View } from './view.component';

export const defaultProps = {
  dataSource: {},
  fetchDataSource: Function.prototype,
  unmountDataSource: Function.prototype,
  removeDataSource: Function.prototype,
  updateDataSource: Function.prototype,
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
  },
};

storiesOf('Project/DataSource/View', module).add('Default', () => <View {...defaultProps} />);
