import React from 'react';
import { storiesOf } from '@storybook/react';

import { FilterForm } from './filterForm.component';
import { withTheme } from '../../../.storybook/decorators';
import { history, intl } from '../../../.storybook/helpers';

export const defaultProps = {
  fieldsInfo: {
    field: {
      filterType: ['checkbox'],
      unique: 1,
      fieldType: 'string',
    },
  },
  dataSourceId: '1',
  history,
  intl,
};

export const createProps = {
  ...defaultProps,
  createFilter: Function.prototype,
};

export const editProps = {
  ...defaultProps,
  updateFilter: Function.prototype,
  removeFilter: Function.prototype,
  filter: {
    id: 2,
    datasource: { id: 1 },
    name: 'name',
    filterType: 'checkbox',
    field: 'field',
    fieldType: 'fieldType',
    unique: 'unique',
  },
};

storiesOf('Shared Components|FilterForm', module)
  .addDecorator(withTheme())
  .add('Create form', () => <FilterForm {...createProps} />)
  .add('Edit form', () => <FilterForm {...editProps} />);
