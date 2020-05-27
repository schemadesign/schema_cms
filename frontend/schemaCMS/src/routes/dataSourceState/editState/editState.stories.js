import React from 'react';
import { storiesOf } from '@storybook/react';

import { EditState } from './editState.component';
import { withTheme } from '../../../.storybook/decorators';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';
import { project } from '../../../modules/project/project.mocks';

export const defaultProps = {
  removeState: Function.prototype,
  updateState: Function.prototype,
  fetchDataSourceTags: Function.prototype,
  fetchFilters: Function.prototype,
  project,
  dataSourceTags: [],
  filters: [],
  state: {
    filters: [],
  },
  userRole: ROLES.ADMIN,
};

storiesOf('DataSourceState', module)
  .addDecorator(withTheme())
  .add('Default', () => <EditState {...defaultProps} />);
