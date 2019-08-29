import React from 'react';
import { storiesOf } from '@storybook/react';
import { identity } from 'ramda';

import { View } from './view.component';

const defaultProps = {
  fetchOne: identity,
  project: {
    title: 'Project Name',
    description: 'Description',
    slug: 'schemacms/api/project_title',
    created: '2019-08-26T11:05:12+0000',
    status: 'Status',
    owner: {
      id: '1',
      firstName: 'Firstname',
      lastName: 'Lastname',
    },
    editors: ['3da51ad7-a8b4-4755-b5d6-b51f01f1cb2e', '44da51ad7-a8b4-4355-b5d6-b51f01f1cb2e'],
    modified: '2019-08-21T10:12:52.030069Z',
  },
  history: {},
};

const emptyProps = {
  fetchOne: identity,
  project: {},
  history: {},
};

storiesOf('View', module)
  .add('default', () => <View {...defaultProps} />)
  .add('empty', () => <View {...emptyProps} />);
