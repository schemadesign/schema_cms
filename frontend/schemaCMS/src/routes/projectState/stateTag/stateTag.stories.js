import React from 'react';
import { storiesOf } from '@storybook/react';

import { StateTag } from './stateTag.component';
import { state } from '../../../modules/projectState/projectState.mock';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';
import { history, intl } from '../../../.storybook/helpers';
import { withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  handleSubmit: Function.prototype,
  setValues: Function.prototype,
  isSubmitting: false,
  dirty: true,
  values: [1],
  tags: [{ name: 'name', id: 1, tags: [{ id: 1, value: 'value' }, { id: 2, value: 'value 2' }] }],
  userRole: ROLES.ADMIN,
  state,
  fetchTags: Function.prototype,
  intl,
  history,
};

storiesOf('StateTag', module)
  .addDecorator(withTheme())
  .add('Default', () => <StateTag {...defaultProps} />);
