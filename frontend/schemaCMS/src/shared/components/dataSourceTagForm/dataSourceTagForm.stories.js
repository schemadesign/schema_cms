import React from 'react';
import { storiesOf } from '@storybook/react';

import { DataSourceTagForm } from './dataSourceTagForm.component';
import { withTheme } from '../../../.storybook/decorators';
import { history, intl } from '../../../.storybook/helpers';

export const defaultProps = {
  dataSourceId: '1',
  history,
  intl,
};

export const createProps = {
  ...defaultProps,
  createTag: Function.prototype,
};

export const editProps = {
  ...defaultProps,
  updateTag: Function.prototype,
  removeTag: Function.prototype,
  tag: {
    id: 2,
    datasource: { id: 1 },
    key: 'namekey',
    value: 'value',
  },
};

storiesOf('Shared Components|DataSourceTagForm', module)
  .addDecorator(withTheme())
  .add('Create form', () => <DataSourceTagForm {...createProps} />)
  .add('Edit form', () => <DataSourceTagForm {...editProps} />);
