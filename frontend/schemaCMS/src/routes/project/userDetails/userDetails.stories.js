import React from 'react';
import { storiesOf } from '@storybook/react';

import { UserDetails } from './userDetails.component';
import { withTheme } from '../../../.storybook/decorators';

export const defaultProps = {
  fetchUser: Function.prototype,
  removeEditorFromProject: Function.prototype,
  userData: {},
  isAdmin: true,
  history: { push: Function.prototype },
  match: {
    params: {
      userId: '1',
      projectId: '1',
    },
  },
};

storiesOf('Project|UserDetails', module)
  .addDecorator(withTheme())
  .add('Default', () => <UserDetails {...defaultProps} />);
