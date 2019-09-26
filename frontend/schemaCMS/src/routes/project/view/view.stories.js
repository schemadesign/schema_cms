import React from 'react';
import { storiesOf } from '@storybook/react';

import { ROLES } from '../../../modules/userProfile/userProfile.constants';
import { withRouter, withTheme } from '../../../.storybook/decorators';
import { View } from './view.component';

const emptyProps = {
  fetchProject: Function.prototype,
  unmountProject: Function.prototype,
  removeProject: Function.prototype,
  user: {
    role: ROLES.ADMIN,
  },
  project: {
    id: '1',
    error: {},
  },
  history: {
    push: Function.prototype,
  },
  match: {
    params: {
      projectId: '100',
    },
  },
  intl: { formatMessage: ({ defaultMessage }) => defaultMessage },
};

export const defaultProps = {
  ...emptyProps,
  project: {
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
      dataSources: {
        count: 3,
      },
    },
    editors: ['3da51ad7-a8b4-4755-b5d6-b51f01f1cb2e', '44da51ad7-a8b4-4355-b5d6-b51f01f1cb2e'],
    modified: '2019-08-21T10:12:52.030069Z',
  },
};

storiesOf('Project/View', module)
  .addDecorator(withRouter)
  .addDecorator(withTheme())
  .add('default', () => <View {...defaultProps} />)
  .add('empty', () => <View {...emptyProps} />);
