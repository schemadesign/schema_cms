import React from 'react';
import { storiesOf } from '@storybook/react';
import { identity } from 'ramda';

import { List } from './list.component';

export const defaultProps = {
  list: [
    {
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
    },
    {
      title: 'Honec sodales libero non fermentum aliquam',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed molestie fermentum dictum. In id posuere nibh.',
      slug: 'schemacms/api/honec-sodales-libero-non-fermentum-aliquam-honec-sodales-libero-non-fermentum-aliquam',
      created: '2019-08-26T11:05:12+0000',
      status: 'Published',
      owner: {
        id: '2',
        firstName: 'Tadeusz',
        lastName: 'Kosciuszko',
      },
    },
  ],
  fetchProjectsList: identity,
  isMenuOpen: false,
  toggleMenu: identity,
};

export const emptyListProps = {
  list: [],
  fetchProjectsList: identity,
  isMenuOpen: false,
  toggleMenu: identity,
};

storiesOf('List', module)
  .add('list', () => <List {...defaultProps} />)
  .add('empty', () => <List {...emptyListProps} />);
