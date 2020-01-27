import React from 'react';
import { storiesOf } from '@storybook/react';

import { DataSourceTags } from './dataSourceTags.component';
import { withTheme } from '../../../.storybook/decorators';
import { history, intl } from '../../../.storybook/helpers';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';

export const defaultProps = {
  userRole: ROLES.ADMIN,
  dataSource: {
    project: { id: '1' },
  },
  tags: [
    {
      key: 'key 1',
      id: 1,
      isActive: true,
    },
    {
      key: 'key 2',
      id: 2,
      isActive: false,
    },
  ],
  fetchTags: Function.prototype,
  setTags: Function.prototype,
  history,
  intl,
  match: {
    params: {
      dataSourceId: '1',
    },
    url: '/datasource/1/tag',
  },
};

export const noTagsProps = {
  ...defaultProps,
  filters: [],
};

storiesOf('Data Source|DataSourceTags', module)
  .addDecorator(withTheme())
  .add('No Data', () => <DataSourceTags {...noTagsProps} />)
  .add('Default', () => <DataSourceTags {...defaultProps} />);
