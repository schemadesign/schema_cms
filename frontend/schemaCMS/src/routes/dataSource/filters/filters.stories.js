import React from 'react';
import { storiesOf } from '@storybook/react';

import { Filters } from './filters.component';
import { withRouter, withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  dataSource: {
    project: '1',
  },
  history: {
    push: Function.prototype,
  },
  filters: [
    {
      name: 'name 1',
      id: 1,
      isActive: true,
    },
    {
      name: 'name 2',
      id: 2,
      isActive: false,
    },
  ],
  fetchFilters: Function.prototype,
  setFilters: Function.prototype,
  match: {
    params: {
      dataSourceId: '1',
    },
  },
};

storiesOf('Data Source|Filters', module)
  .addDecorator(withRouter)
  .addDecorator(withTheme())
  .add('Default', () => <Filters {...defaultProps} />);
