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
  tags: [
    {
      key: 'key 1',
      id: 1,
      isActive: true,
    },
    {
      key: 'key 2',
      id: 2,
      isActive: false,
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
