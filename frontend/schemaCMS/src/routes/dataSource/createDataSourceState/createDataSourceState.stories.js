import React from 'react';
import { storiesOf } from '@storybook/react';

import { CreateDataSourceState } from './createDataSourceState.component';
import { withTheme } from '../../../.storybook/decorators';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';
import { project } from '../../../modules/project/project.mocks';

export const defaultProps = {
  fetchFilters: Function.prototype,
  fetchDataSourceTags: Function.prototype,
  createState: Function.prototype,
  dataSourceTags: [],
  filters: [],
  project,
  userRole: ROLES.ADMIN,
};

storiesOf('DataSource|CreateDataSourceState', module)
  .addDecorator(withTheme())
  .add('Default', () => <CreateDataSourceState {...defaultProps} />);
