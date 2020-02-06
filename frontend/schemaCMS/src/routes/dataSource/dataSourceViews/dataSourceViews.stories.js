import React from 'react';
import { storiesOf } from '@storybook/react';

import { DataSourceViews } from './dataSourceViews.component';
import { withTheme } from '../../../.storybook/decorators';
import { intl } from '../../../.storybook/helpers';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';

export const defaultProps = {
  userRole: ROLES.ADMIN,
  dataSource: {
    name: 'name',
    project: { id: '1' },
  },
  intl,
  match: {
    url: 'url',
  },
};

storiesOf('Data Source|DataSourceViews', module)
  .addDecorator(withTheme())
  .add('Default', () => <DataSourceViews {...defaultProps} />);
