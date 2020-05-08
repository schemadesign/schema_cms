import React from 'react';
import { storiesOf } from '@storybook/react';

import { TagCategories } from './tagCategories.component';
import { withTheme } from '../../../.storybook/decorators';
import { history, intl } from '../../../.storybook/helpers';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';
import { project } from '../../../modules/project/project.mocks';

export const defaultProps = {
  userRole: ROLES.ADMIN,
  project,
  tagCategories: [
    {
      key: 'key 1',
      id: 1,
      createdBy: 'createdBy',
      created: '2020-02-21T08:34:24+0000',
      tags: [],
    },
    {
      key: 'key 2',
      id: 2,
      createdBy: 'createdBy',
      created: '2020-02-21T08:34:24+0000',
      tags: [{}],
    },
  ],
  fetchTagCategories: Function.prototype,
  history,
  intl,
  match: {
    params: {
      projectId: '1',
    },
    url: '/project/1/tag',
  },
};

export const noTagsProps = {
  ...defaultProps,
  filters: [],
};

storiesOf('Project|TagCategories', module)
  .addDecorator(withTheme())
  .add('No Data', () => <TagCategories {...noTagsProps} />)
  .add('Default', () => <TagCategories {...defaultProps} />);
