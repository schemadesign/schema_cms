import React from 'react';
import { storiesOf } from '@storybook/react';

import { View } from './view.component';

export const defaultProps = {
  dataWrangling: {
    description: 'Change to lowercase',
    code: 'df.columns = map(str.lower, df.columns)',
  },
  fetchDataWrangling: Function.prototype,
  unmountDataWrangling: Function.prototype,
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
    },
  },
};

storiesOf('Project/DataSource/View/DataWrangling/View', module).add('Default', () => <View {...defaultProps} />);
