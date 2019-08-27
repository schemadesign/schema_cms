import React from 'react';
import { storiesOf } from '@storybook/react';
import { identity } from 'ramda';

import { List } from './list.component';

const defaultProps = {
  list: [
    {
      name: 'Project Name',
      description: 'Description',
      slug: 'schemacms/api/project_name',
      created: '2019-08-26T11:05:12+0000',
      status: 'Status',
      owner: 'First Lastname',
    },
    {
      name: 'Honec sodales libero non fermentum aliquam',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed molestie fermentum dictum. In id posuere nibh.',
      slug: 'schemacms/api/honec-sodales-libero-non-fermentum-aliquam-honec-sodales-libero-non-fermentum-aliquam',
      created: '2019-08-26T11:05:12+0000',
      status: 'Published',
      owner: 'Tadeusz Kosciuszko',
    },
  ],
  fetchProjectsList: identity,
};

const emptyListProps = {
  list: [],
  fetchProjectsList: identity,
};

storiesOf('List', module)
  .add('list', () => <List {...defaultProps} />)
  .add('empty', () => <List {...emptyListProps} />);
