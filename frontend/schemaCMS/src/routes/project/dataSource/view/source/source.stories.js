import React from 'react';
import { storiesOf } from '@storybook/react';

import { Source } from './source.component';

const defaultProps = {
  values: {},
  onChange: Function.prototype,
  setFieldValue: Function.prototype,
  intl: {
    formatMessage: Function.prototype,
  },
  errors: {},
  touched: {},
  dataSource: {},
};

storiesOf('Project/DataSource/View/Source', module).add('Default', () => <Source />);
