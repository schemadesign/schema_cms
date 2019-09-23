import React from 'react';
import { storiesOf } from '@storybook/react';

import { withRouter } from '../../../.storybook/decorators';
import { List } from './list.component';

const defaultProps = {
  createDataSource: Function.prototype,
  fetchDataSources: Function.prototype,
  cancelFetchListLoop: Function.prototype,
  dataSources: [
    {
      created: '2019-09-09T11:23:40+0000',
      createdBy: { firstName: 'firstName', lastName: 'lastName' },
      id: 17,
      metaData: {
        fields: 11,
        items: 246,
      },
      name: 'name',
      status: 'done',
    },
  ],
  history: {
    push: Function.prototype,
  },
  match: {
    params: {
      projectId: '1',
    },
  },
  intl: {
    formatMessage: ({ defaultMessage }) => defaultMessage,
  },
};

storiesOf('Project/DataSource/List', module)
  .addDecorator(withRouter)
  .add('Default', () => <List {...defaultProps} />);
