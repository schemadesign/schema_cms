import React from 'react';
import { storiesOf } from '@storybook/react';

import { DataSourceTags } from './dataSourceTags.component';
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
  .add('Default', () => <DataSourceTags {...defaultProps} />);
