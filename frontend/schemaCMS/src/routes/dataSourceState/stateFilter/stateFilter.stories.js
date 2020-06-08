import React from 'react';
import { storiesOf } from '@storybook/react';

import { StateFilter } from './stateFilter.component';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';
import { withTheme } from '../../../.storybook/decorators';
import { project } from '../../../modules/project/project.mocks';

export const defaultProps = {
  fetchFilter: Function.prototype,
  fetchFieldsInfo: Function.prototype,
  filter: {
    id: 'id',
  },
  fieldsInfo: [],
  userRole: ROLES.ADMIN,
  project,
};

storiesOf('DataSourceState/StateFilter', module)
  .addDecorator(withTheme())
  .add('Default', () => <StateFilter {...defaultProps} />);
