import React from 'react';
import { storiesOf } from '@storybook/react';

import { DataSourceTagForm } from './dataSourceTagForm.component';
import { withTheme } from '../../../.storybook/decorators';

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
    datasource: { id: 1 },
    name: 'name',
    tags: [{ id: 1, value: 'value' }, { id: 'create_2', value: 'value' }],
    deleteTags: [],
  },
};

storiesOf('Shared Components|DataSourceTagForm', module)
  .addDecorator(withTheme())
  .add('Create form', () => <DataSourceTagForm {...defaultProps} />)
  .add('Edit form', () => <DataSourceTagForm {...propsWithTags} />);
