import React from 'react';
import { storiesOf } from '@storybook/react';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';

import { UserProfile } from './userProfile.component';
import { INITIAL_VALUES, ROLES } from '../../../modules/userProfile/userProfile.constants';
import { withTheme } from '../../../.storybook/decorators';

const history = createMemoryHistory();

export const defaultProps = {
  userData: { ...INITIAL_VALUES, role: ROLES.EDITOR },
  updateMe: Function.prototype,
  makeAdmin: Function.prototype,
  isSettings: false,
  isAdmin: true,
  match: { params: { userId: '1' } },
  history: {
    push: Function.prototype,
  },
  intl: {
    formatMessage: ({ defaultMessage }) => defaultMessage,
  },
};

storiesOf('Shared Components|UserProfile', module)
  .addDecorator(withTheme())
  .add('Default', () => (
    <Router history={history}>
      <UserProfile {...defaultProps} />
    </Router>
  ));
