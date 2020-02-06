import React from 'react';
import { storiesOf } from '@storybook/react';

import { Filter } from './filter.component';
import { withTheme } from '../../.storybook/decorators';
import { ROLES } from '../../modules/userProfile/userProfile.constants';
import { history, intl } from '../../.storybook/helpers';

export const defaultProps = {
  userRole: ROLES.ADMIN,
  updateFilter: Function.prototype,
  fetchFieldsInfo: Function.prototype,
  fieldsInfo: [
    {
      fieldName: 'fieldName',
      fieldType: 'fieldType',
      filterType: ['Filter Type 1', 'Filter Type 2', 'Filter Type 3'],
      unique: 'unique',
    },
  ],
  fetchFilter: () => Promise.resolve({ datasource: { id: '1' } }),
  removeFilter: Function.prototype,
  filter: {
    datasource: {
      id: '1',
      name: 'name',
    },
  },
  history,
  intl,
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
