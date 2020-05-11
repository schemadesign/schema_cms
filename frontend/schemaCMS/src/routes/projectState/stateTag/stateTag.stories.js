import React from 'react';
import { storiesOf } from '@storybook/react';

import { StateTag } from './stateTag.component';
import { state } from '../../../modules/projectState/projectState.mock';
import { ROLES } from '../../../modules/userProfile/userProfile.constants';
import { history, intl } from '../../../.storybook/helpers';
import { withTheme } from '../../../.storybook/decorators';
import { project } from '../../../modules/project/project.mocks';

export const defaultProps = {
  handleSubmit: Function.prototype,
  setValues: Function.prototype,
  isSubmitting: false,
  dirty: true,
  values: [1],
  tags: [{ name: 'name', id: 1, tags: [{ id: 1, value: 'value' }, { id: 2, value: 'value 2' }] }],
  userRole: ROLES.ADMIN,
  state,
  fetchTagCategories: Function.prototype,
  intl,
  history,
  project,
};

storiesOf('StateTag', module)
  .addDecorator(withTheme())
  .add('Default', () => <StateTag {...defaultProps} />);
