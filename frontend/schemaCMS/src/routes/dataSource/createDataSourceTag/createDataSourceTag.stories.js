import React from 'react';
import { storiesOf } from '@storybook/react';

import { CreateDataSourceTag } from './createDataSourceTag.component';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';
import { intl, history } from '../../../.storybook/helpers';
import { withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  userRole: ROLES.ADMIN,
  createTag: Function.prototype,
  dataSource: {
    name: 'dataSourceName',
    project: {
      id: 'projectId',
    },
  },
  match: {
    params: {
      dataSourceId: 'dataSourceId',
    },
  },
  history,
  intl,
};

storiesOf('Data Source|CreateDataSourceTag', module)
  .addDecorator(withTheme())
  .add('Default', () => <CreateDataSourceTag {...defaultProps} />);
