import React from 'react';
import { storiesOf } from '@storybook/react';
import { Theme } from 'schemaUI';

import { withRouter, withTheme } from '../../../.storybook/decorators';
import { PROJECT_STATUSES } from '../../../modules/project/project.constants';
import { List } from './list.component';

export const emptyListProps = {
  isAdmin: true,
  list: [],
  fetchProjectsList: Function.prototype,
  history: {},
  intl: { formatMessage: ({ defaultMessage }) => defaultMessage },
};

export const defaultProps = {
  ...emptyListProps,
  list: [
    {
      title: 'Project Name',
      description: 'Description',
      slug: 'project_title',
      created: '2019-08-26T11:05:12+0000',
      status: PROJECT_STATUSES.IN_PROGRESS,
      owner: {
        id: '1',
        firstName: 'Sed sed risus a nibh',
        lastName: 'Maecenas nec pulvinar ex',
      },
    },
    {
      title: 'Honec sodales libero non fermentum aliquam',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed molestie fermentum dictum. In id posuere nibh.',
      slug: 'wuwhonec-sodales-libero-non-fermentum-aliquam-honec-sodales-libero-non-fermentum-aliquam',
      created: '2019-08-26T11:05:12+0000',
      status: PROJECT_STATUSES.PUBLISHED,
      owner: {
        id: '2',
        firstName: 'Tadeusz',
        lastName: 'Kosciuszko',
      },
    },
  ],
};

const editorProps = {
  ...defaultProps,
  isAdmin: false,
};

storiesOf('Project/List', module)
  .addDecorator(withRouter)
  .addDecorator(withTheme())
  .add('empty', () => <List {...emptyListProps} />)
  .add('admin list', () => <List {...defaultProps} />);

storiesOf('Project/List', module)
  .addDecorator(withRouter)
  .addDecorator(withTheme(Theme.light))
  .add('editor list', () => <List {...editorProps} />);
