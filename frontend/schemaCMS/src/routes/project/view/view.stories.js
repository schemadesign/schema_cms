import React from 'react';
import { storiesOf } from '@storybook/react';

import { ROLES } from '../../../modules/userProfile/userProfile.constants';
import { withTheme } from '../../../.storybook/decorators';
import { history, intl } from '../../../.storybook/helpers';
import { View } from './view.component';

const emptyProps = {
  fetchProject: Function.prototype,
  removeProject: Function.prototype,
  user: {
    role: ROLES.ADMIN,
  },
  project: {},
  history,
  intl,
  match: {
    params: {
      projectId: '100',
    },
  },
  isAdmin: true,
};

export const defaultProps = {
  ...emptyProps,
  project: {
    id: '100',
    title: 'Project Name',
    description: 'Description',
    slug: 'project_title',
    created: '2019-08-26T11:05:12+0000',
    status: 'Status',
    owner: {
      id: '1',
      firstName: 'Firstname',
      lastName: 'Lastname',
    },
    meta: {
      dataSources: 3,
      pages: 1,
      users: 2,
      charts: 0,
    },
    editors: ['3da51ad7-a8b4-4755-b5d6-b51f01f1cb2e', '44da51ad7-a8b4-4355-b5d6-b51f01f1cb2e'],
    modified: '2019-08-21T10:12:52.030069Z',
  },
};

storiesOf('Project|View', module)
  .addDecorator(withTheme())
  .add('No data', () => <View {...emptyProps} />)
  .add('Default', () => <View {...defaultProps} />);
