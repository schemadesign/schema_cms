import React from 'react';
import { storiesOf } from '@storybook/react';

import { Filters } from './filters.component';
import { withTheme } from '../../../.storybook/decorators';
import { history, intl } from '../../../.storybook/helpers';

export const defaultProps = {
  dataSource: {
    project: { id: '1' },
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
  history,
  intl,
  match: {
    params: {
      dataSourceId: '1',
    },
    url: '/datasource/1/filters',
  },
};

export const noFiltersProps = {
  ...defaultProps,
  filters: [],
};

storiesOf('Data Source|Filters', module)
  .addDecorator(withTheme())
  .add('No Data', () => <Filters {...noFiltersProps} />)
  .add('Default', () => <Filters {...defaultProps} />);
