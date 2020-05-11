import React from 'react';
import { storiesOf } from '@storybook/react';

import { TagCategoryForm } from './tagCategoryForm.component';
import { withTheme } from '../../../.storybook/decorators';
import { project } from '../../../modules/project/project.mocks';

export const defaultProps = {
  handleChange: Function.prototype,
  setFieldValue: Function.prototype,
  validateForm: Function.prototype,
  values: {
    name: '',
    tags: [],
    deleteTags: [],
  },
};

export const propsWithTags = {
  ...defaultProps,
  values: {
    id: 2,
    project,
    name: 'name',
    tags: [{ id: 1, value: 'value' }, { value: 'value' }],
    deleteTags: [],
  },
};

storiesOf('Shared Components|TagCategoryForm', module)
  .addDecorator(withTheme())
  .add('Create form', () => <TagCategoryForm {...defaultProps} />)
  .add('Edit form', () => <TagCategoryForm {...propsWithTags} />);
