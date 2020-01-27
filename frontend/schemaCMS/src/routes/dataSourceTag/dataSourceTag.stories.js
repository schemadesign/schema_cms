import React from 'react';
import { storiesOf } from '@storybook/react';

import { DataSourceTag } from './dataSourceTag.component';
import { withTheme } from '../../.storybook/decorators';
import { ROLES } from '../../modules/userProfile/userProfile.constants';
import { history, intl } from '../../.storybook/helpers';

export const defaultProps = {
  userRole: ROLES.ADMIN,
  updateTag: Function.prototype,
  fetchFieldsInfo: Function.prototype,
  fetchTag: () => Promise.resolve({ datasource: { id: '1' } }),
  removeTag: Function.prototype,
  tag: {
    key: 'key',
    value: 'value',
    datasource: {
      id: '1',
      name: 'name',
    },
  },
  history,
  intl,
  match: {
    params: {
      tagId: '1',
      step: '5',
    },
  },
};

storiesOf('DataSourceTag', module)
  .addDecorator(withTheme())
  .add('Default', () => <DataSourceTag {...defaultProps} />);
