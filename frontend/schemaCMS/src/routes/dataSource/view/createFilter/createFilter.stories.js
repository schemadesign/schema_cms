import React from 'react';
import { storiesOf } from '@storybook/react';

import { CreateFilter } from './createFilter.component';
import { withTheme } from '../../../../.storybook/decorators';

export const defaultProps = {
  fetchFieldsInfo: Function.prototype,
  createFilter: Function.prototype,
  fieldsInfo: {
    field: {
      fieldType: 'fieldType',
      filterType: ['filterType'],
      unique: 'unique',
    },
  },
  dataSource: {
    name: 'name',
  },
  match: { params: { dataSourceId: '1' } },
  history: {
    push: Function.prototype,
  },
};

storiesOf('Data Source|CreateFilter', module)
  .addDecorator(withTheme())
  .add('Default', () => <CreateFilter {...defaultProps} />);
