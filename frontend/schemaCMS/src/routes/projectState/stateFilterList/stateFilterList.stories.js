import React from 'react';
import { storiesOf } from '@storybook/react';

import { StateFilterList } from './stateFilterList.component';
import { state } from '../../../modules/projectState/projectState.mock';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';
import { history, intl } from '../../../.storybook/helpers';
import { withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  handleSubmit: Function.prototype,
  setValues: Function.prototype,
  isSubmitting: false,
  dirty: false,
  userRole: ROLES.ADMIN,
  state,
  filters: [],
  values: [],
  fetchFilters: Function.prototype,
  intl,
  history,
};

storiesOf('ProjectState/StateFilterList', module)
  .addDecorator(withTheme())
  .add('Default', () => <StateFilterList {...defaultProps} />);
