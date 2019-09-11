import React from 'react';
import { storiesOf } from '@storybook/react';

import { View } from './view.component';

const defaultProps = {
  dataSource: {},
  fetchDataSource: Function.prototype,
  unmountDataSource: Function.prototype,
  removeDataSource: Function.prototype,
  handleChange: Function.prototype,
  handleSubmit: Function.prototype,
  setFieldValue: Function.prototype,
  intl: {
    formatMessage: ({ defaultMessage }) => defaultMessage,
  },
  history: {
    push: Function.prototype,
  },
  values: {},
  match: {
    params: {
      projectId: '1',
      dataSourceId: '1',
      step: '1',
    },
  },
};

storiesOf('Project/DataSource/View', module).add('Default', () => <View {...defaultProps} />);
