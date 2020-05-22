import React from 'react';
import { storiesOf } from '@storybook/react';

import { CreateDataSourceState } from './createDataSourceState.component';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';
import { history, intl } from '../../../.storybook/helpers';
import { withTheme } from '../../../.storybook/decorators';
import { state } from '../../../modules/projectState/projectState.mock';

export const defaultProps = {
  handleSubmit: Function.prototype,
  handleChange: Function.prototype,
  setFieldValue: Function.prototype,
  values: state,
  isSubmitting: false,
  isValid: true,
  userRole: ROLES.ADMIN,
  fetchDataSources: Function.prototype,
  dataSources: [{ name: 'name', id: 'id' }],
  project: { name: 'name', id: 'id' },
  intl,
  history,
  match: {
    params: {
      dataSourceId: 'dataSourceId',
    },
  },
};

storiesOf('Project|CreateProjectState', module)
  .addDecorator(withTheme())
  .add('Default', () => <CreateDataSourceState {...defaultProps} />);
