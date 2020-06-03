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
  fetchState: jest.fn().mockReturnValue(Promise.resolve({ datasource: { id: 'dataSourceId' } })),
  project,
  dataSourceTags: [],
  filters: [],
  state: {
    filters: [],
    datasource: {
      id: 1,
      name: 'dataSourceName',
    },
  },
  userRole: ROLES.ADMIN,
};

storiesOf('DataSourceState', module)
  .addDecorator(withTheme())
  .add('Default', () => <EditState {...defaultProps} />);
