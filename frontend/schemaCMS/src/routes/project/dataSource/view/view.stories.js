import React from 'react';
import { storiesOf } from '@storybook/react';

import { View } from './view.component';

export const defaultProps = {
  dataSource: {},
  dataWrangling: [],
  fetchDataSource: Function.prototype,
  unmountDataSource: Function.prototype,
  removeDataSource: Function.prototype,
  updateDataSource: Function.prototype,
  fetchDataWrangling: Function.prototype,
  uploadScript: Function.prototype,
  sendUpdatedDataWrangling: Function.prototype,
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

storiesOf('Project/DataSource/View', module).add('Default', () => <View {...defaultProps} />);
