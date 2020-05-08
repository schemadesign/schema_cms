import React from 'react';
import { storiesOf } from '@storybook/react';

import { TagCategory } from './tagCategory.component';
import { withTheme } from '../../.storybook/decorators';
import { history, intl } from '../../.storybook/helpers';
import { ROLES } from '../../modules/userProfile/userProfile.constants';
import { project } from '../../modules/project/project.mocks';

export const defaultProps = {
  userRole: ROLES.ADMIN,
  isSubmitting: false,
  dirty: false,
  isValid: true,
  handleSubmit: Function.prototype,
  handleChange: Function.prototype,
  setFieldValue: Function.prototype,
  updateTag: Function.prototype,
  fetchTagCategory: () => Promise.resolve({ project }),
  removeTagCategory: Function.prototype,
  tagCategory: {
    id: 2,
    project,
    name: 'name',
    tags: [{ id: 1, value: 'value' }],
  },
  values: {
    name: 'name',
    tags: [{ id: 1, value: 'value' }],
  },
  history,
  intl,
  project,
  match: {
    params: {
      tagCategoryId: '1',
    },
  },
};

storiesOf('TagCategory', module)
  .addDecorator(withTheme())
  .add('Default', () => <TagCategory {...defaultProps} />);
