import React from 'react';
import { storiesOf } from '@storybook/react';

import { FilterForm } from './filterForm.component';
import { withTheme } from '../../../.storybook/decorators';

const defaultProps = {
  fieldsInfo: {
    field: {
      filterType: ['checkbox'],
      unique: 1,
      fieldType: 'string',
    },
  },
};

export const createProps = {
  ...defaultProps,
  createFilter: Function.prototype,
  dataSourceId: '1',
  history: {
    push: Function.prototype,
  },
};

export const editProps = {
  ...defaultProps,
  updateFilter: Function.prototype,
  removeFilter: Function.prototype,
  filter: {
    name: 'name',
    filterType: 'filterType',
    field: 'field',
    fieldType: 'fieldType',
    unique: 'unique',
  },
};

storiesOf('FilterForm', module)
  .addDecorator(withTheme())
  .add('Create form', () => <FilterForm {...createProps} />)
  .add('Edit form', () => <FilterForm {...editProps} />);
