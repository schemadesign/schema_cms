import React from 'react';
import { storiesOf } from '@storybook/react';

import { CreateDataSource } from './createDataSource.component';
import { withTheme } from '../../../.storybook/decorators';
import { history, intl } from '../../../.storybook/helpers';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';

export const defaultProps = {
  userRole: ROLES.ADMIN,
  createDataSource: Function.prototype,
  onDataSourceChange: Function.prototype,
  uploadingDataSources: [],
  history,
  intl,
  match: {
    params: {
      projectId: '1',
    },
  },
};

storiesOf('Project|CreateDataSource', module)
  .addDecorator(withTheme())
  .add('Default', () => <CreateDataSource {...defaultProps} />);
