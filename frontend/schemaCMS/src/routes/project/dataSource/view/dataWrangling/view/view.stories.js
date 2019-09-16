import React from 'react';
import { storiesOf } from '@storybook/react';

import { View } from './view.component';

const defaultProps = {
  intl: {
    dataWrangling: {
      description: 'Change to lowercase',
      code: 'df.columns = map(str.lower, df.columns)',
    },
    fetchDataWrangling: Function.prototype,
    unmountDataWrangling: Function.prototype,
    formatMessage: ({ defaultMessage }) => defaultMessage,
  },
};

storiesOf('Project/DataSource/View/DataWrangling/View', module).add('Default', () => <View {...defaultProps} />);
