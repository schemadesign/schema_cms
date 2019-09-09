import React from 'react';
import { storiesOf } from '@storybook/react';

import { withRouter } from '../../../.storybook/decorators';
import { List } from './list.component';

export const defaultProps = {
  list: [
    {
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
    },
    {
      title: 'Honec sodales libero non fermentum aliquam',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed molestie fermentum dictum. In id posuere nibh.',
      slug: 'wuwhonec-sodales-libero-non-fermentum-aliquam-honec-sodales-libero-non-fermentum-aliquam',
      created: '2019-08-26T11:05:12+0000',
      status: 'Published',
      owner: {
        id: '2',
        firstName: 'Tadeusz',
        lastName: 'Kosciuszko',
      },
    },
  ],
  fetchProjectsList: Function.prototype,
  history: {},
  intl: { formatMessage: ({ defaultMessage }) => defaultMessage },
};

export const emptyListProps = {
  list: [],
  fetchProjectsList: Function.prototype,
  history: {},
  intl: { formatMessage: ({ defaultMessage }) => defaultMessage },
};

storiesOf('Project/List', module)
  .addDecorator(withRouter)
  .add('list', () => <List {...defaultProps} />)
  .add('empty', () => <List {...emptyListProps} />);
