import React from 'react';
import { storiesOf } from '@storybook/react';

import { List } from './list.component';

const defaultProps = {
  createDataSource: Function.prototype,
  match: {
    params: {
      projectId: '1',
    },
  },
};

storiesOf('Project/DataSource/List', module).add('Default', () => <List {...defaultProps} />);
