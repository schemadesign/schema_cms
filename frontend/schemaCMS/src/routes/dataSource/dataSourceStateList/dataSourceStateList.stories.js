import React from 'react';
import { storiesOf } from '@storybook/react';

import { DataSourceStateList } from './dataSourceStateList.component';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';
import { history, intl } from '../../../.storybook/helpers';
import { withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  userRole: ROLES.ADMIN,
  project: { name: 'name', id: '1' },
  dataSource: { name: 'name', id: '1' },
  states: [
    {
      name: 'name 1',
      id: 1,
      description: 'description',
    },
    {
      name: 'name 2',
      id: 2,
      description: 'description',
    },
  ],
  fetchStates: Function.prototype,
  intl,
  history,
  match: {
    params: {
      dataSourceId: '1',
    },
    url: '/',
  },
};

export const noStatesProps = {
  ...defaultProps,
  states: [],
};

storiesOf('DataSourceStateList', module)
  .addDecorator(withTheme())
  .add('Default', () => <DataSourceStateList {...defaultProps} />)
  .add('No states', () => <DataSourceStateList {...noStatesProps} />);
