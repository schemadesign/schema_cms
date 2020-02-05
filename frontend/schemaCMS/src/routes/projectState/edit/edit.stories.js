import React from 'react';
import { storiesOf } from '@storybook/react';

import { Edit } from './edit.component';
import { withTheme } from '../../../.storybook/decorators';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';
import { intl, history } from '../../../.storybook/helpers';
import { state } from '../../../modules/projectState/projectState.mock';

export const defaultProps = {
  handleSubmit: Function.prototype,
  handleChange: Function.prototype,
  setFieldValue: Function.prototype,
  values: state,
  isSubmitting: false,
  isValid: true,
  userRole: ROLES.ADMIN,
  state,
  fetchDataSources: Function.prototype,
  dataSources: [{ name: 'name', id: 'id' }],
  intl,
  history,
};

storiesOf('ProjectState/Edit', module)
  .addDecorator(withTheme())
  .add('Default', () => <Edit {...defaultProps} />);
