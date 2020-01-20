import React from 'react';
import { storiesOf } from '@storybook/react';

import { CreateFilter } from './createFilter.component';
import { withTheme } from '../../../.storybook/decorators';
import { history, intl } from '../../../.storybook/helpers';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';

export const defaultProps = {
  userRole: ROLES.ADMIN,
  fetchFieldsInfo: Function.prototype,
  createFilter: Function.prototype,
  fieldsInfo: {
    field: {
      fieldType: 'fieldType',
      filterType: ['Filter Type 1', 'Filter Type 2', 'Filter Type 3'],
      unique: 'unique',
    },
  },
  dataSource: {
    name: 'name',
    project: { id: 1 },
  },
  history,
  intl,
  match: { params: { dataSourceId: '1' } },
};

storiesOf('Data Source|CreateFilter', module)
  .addDecorator(withTheme())
  .add('Default', () => <CreateFilter {...defaultProps} />);
