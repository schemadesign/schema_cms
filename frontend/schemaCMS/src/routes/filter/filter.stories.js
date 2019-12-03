import React from 'react';
import { storiesOf } from '@storybook/react';

import { Filter } from './filter.component';
import { withTheme } from '../../.storybook/decorators';
import { history } from '../../.storybook/helpers';

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
      id: '1',
      name: 'name',
    },
  },
  history,
  match: {
    params: {
      filterId: '1',
      step: '5',
    },
  },
};

storiesOf('Filter', module)
  .addDecorator(withTheme())
  .add('Default', () => <Filter {...defaultProps} />);
