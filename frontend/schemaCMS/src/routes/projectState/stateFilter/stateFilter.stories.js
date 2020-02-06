import React from 'react';
import { storiesOf } from '@storybook/react';

import { StateFilter } from './stateFilter.component';
import { state } from '../../../modules/projectState/projectState.mock';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';
import { history, intl } from '../../../.storybook/helpers';
import { withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  fetchFilter: Function.prototype,
  fetchFieldsInfo: Function.prototype,
  handleSubmit: Function.prototype,
  handleChange: Function.prototype,
  setFieldValue: Function.prototype,
  isSubmitting: false,
  isValid: true,
  state,
  values: { values: [] },
  filter: {},
  fieldsInfo: [],
  userRole: ROLES.ADMIN,
  match: { params: { filterId: 'filterId' } },
  intl,
  history,
};

storiesOf('ProjectState/StateFilter', module)
  .addDecorator(withTheme())
  .add('Default', () => <StateFilter {...defaultProps} />);
