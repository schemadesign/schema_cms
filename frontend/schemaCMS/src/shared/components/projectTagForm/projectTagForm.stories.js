import React from 'react';
import { storiesOf } from '@storybook/react';

import { ProjectTagForm } from './projectTagForm.component';
import { withTheme } from '../../../.storybook/decorators';
import { project } from '../../../modules/project/project.mocks';

export const defaultProps = {
  handleChange: Function.prototype,
  setFieldValue: Function.prototype,
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
    tags: [{ id: 1, value: 'value' }, { id: 'create_2', value: 'value' }],
    deleteTags: [],
  },
};

storiesOf('Shared Components|DataSourceTagForm', module)
  .addDecorator(withTheme())
  .add('Create form', () => <ProjectTagForm {...defaultProps} />)
  .add('Edit form', () => <ProjectTagForm {...propsWithTags} />);
