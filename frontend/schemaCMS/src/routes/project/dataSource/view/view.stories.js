import React from 'react';
import { storiesOf } from '@storybook/react';

import { View } from './view.component';

const defaultProps = {
  dataSource: {},
  fetchDataSource: Function.prototype,
  unmountDataSource: Function.prototype,
  intl: {
    formatMessage: Function.prototype,
  },
  match: {
    params: {
      projectId: '1',
      dataSourceId: '1',
    },
  },
};

storiesOf('View', module).add('Default', () => <View {...defaultProps} />);
