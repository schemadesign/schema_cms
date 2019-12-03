import React from 'react';
import { storiesOf } from '@storybook/react';

import { CreateFilter } from './createFilter.component';
import { withTheme } from '../../../.storybook/decorators';
import { history } from '../../../.storybook/helpers';

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
  history,
  match: { params: { dataSourceId: '1' } },
};

storiesOf('Data Source|CreateFilter', module)
  .addDecorator(withTheme())
  .add('Default', () => <CreateFilter {...defaultProps} />);
