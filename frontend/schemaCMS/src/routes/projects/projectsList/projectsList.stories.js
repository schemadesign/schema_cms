import React from 'react';
import { storiesOf } from '@storybook/react';

import { ProjectsList } from './projectsList.component';

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

storiesOf('ProjectsList', module).add('list', () => <ProjectsList {...defaultProps} />);

const emptyListProps = {
  list: [],
};

storiesOf('ProjectsList', module).add('empty', () => <ProjectsList {...emptyListProps} />);
