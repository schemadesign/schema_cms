import React from 'react';
import { storiesOf } from '@storybook/react';

import { CreateDataSourceTag } from './createDataSourceTag.component';
import { intl, history } from '../../../.storybook/helpers';
import { withTheme } from '../../../.storybook/decorators';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';

export const defaultProps = {
  userRole: ROLES.ADMIN,
  isSubmitting: false,
  dirty: false,
  isValid: true,
  handleSubmit: Function.prototype,
  createTag: Function.prototype,
  handleChange: Function.prototype,
  setFieldValue: Function.prototype,
  values: {
    name: '',
    tags: [],
  },
  dataSource: {
    name: 'dataSourceName',
    project: {
      id: 'projectId',
    },
  },
  match: {
    params: {
      dataSourceId: 'dataSourceId',
    },
  },
  history,
  intl,
};

storiesOf('Data Source|CreateDataSourceTag', module)
  .addDecorator(withTheme())
  .add('Default', () => <CreateDataSourceTag {...defaultProps} />);
