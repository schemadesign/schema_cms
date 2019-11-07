import React from 'react';
import { storiesOf } from '@storybook/react';

import { Filter } from './filter.component';
import { withTheme } from '../../.storybook/decorators';

export const defaultProps = {
  updateFilter: Function.prototype,
  fetchFieldsInfo: Function.prototype,
  fieldsInfo: {
    field: {
      fieldType: 'fieldType',
      filterType: ['filterType'],
      unique: 'unique',
    },
  },
  fetchFilter: () => Promise.resolve({ datasource: { id: '1' } }),
  removeFilter: Function.prototype,
  filter: {
    datasource: {
      name: 'name',
    },
  },
  match: {
    params: {
      filterId: '1',
    },
  },
};

storiesOf('Filter', module)
  .addDecorator(withTheme())
  .add('Default', () => <Filter {...defaultProps} />);
