import React from 'react';
import { storiesOf } from '@storybook/react';

import { List } from './list.component';

export const defaultProps = {
  fetchFields: Function.prototype,
  fields: {},
  match: {
    params: {
      dataSourceId: '1',
    },
  },
};

storiesOf('List', module).add('Default', () => <List {...defaultProps} />);
