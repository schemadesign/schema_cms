import React from 'react';
import { storiesOf } from '@storybook/react';

import { DataSourceTag } from './dataSourceTag.component';
import { withTheme } from '../../.storybook/decorators';
import { history, intl } from '../../.storybook/helpers';
import { ROLES } from '../../modules/userProfile/userProfile.constants';

export const defaultProps = {
  userRole: ROLES.ADMIN,
  isSubmitting: false,
  dirty: false,
  isValid: true,
  handleSubmit: Function.prototype,
  handleChange: Function.prototype,
  setFieldValue: Function.prototype,
  updateTag: Function.prototype,
  fetchTag: () => Promise.resolve({ datasource: { id: '1' } }),
  removeTag: Function.prototype,
  tag: {
    id: 2,
    datasource: { id: 1 },
    name: 'name',
    tags: [{ id: 1, value: 'value' }],
  },
  values: {
    name: 'name',
    tags: [{ id: 1, value: 'value' }],
  },
  history,
  intl,
  match: {
    params: {
      tagId: '1',
    },
  },
};

storiesOf('DataSourceTag', module)
  .addDecorator(withTheme())
  .add('Default', () => <DataSourceTag {...defaultProps} />);
