import React from 'react';
import { storiesOf } from '@storybook/react';

import { List } from './list.component';

const defaultProps = {
  list: [
    {
      name: 'Project Name',
      description: 'Description',
      url: 'schemacms/api/project_name',
      details: ['0 days ago', 'Status', 'First Lastname'],
    },
    {
      name: 'Honec sodales libero non fermentum aliquam',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed molestie fermentum dictum. In id posuere nibh.',
      url: 'schemacms/api/honec-sodales-libero-non-fermentum-aliquam-honec-sodales-libero-non-fermentum-aliquam',
      details: ['2 days ago', 'Published', 'Tadeusz Kosciuszko'],
    },
  ],
};

const emptyListProps = {
  list: [],
};

storiesOf('List', module)
  .add('list', () => <List {...defaultProps} />)
  .add('empty', () => <List {...emptyListProps} />);
