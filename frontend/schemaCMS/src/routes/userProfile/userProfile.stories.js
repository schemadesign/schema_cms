import React from 'react';
import { storiesOf } from '@storybook/react';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';

import { UserProfile } from './userProfile.component';
import { INITIAL_VALUES } from '../../modules/userProfile/userProfile.constants';

const history = createMemoryHistory();

const defaultProps = {
  values: INITIAL_VALUES,
  errors: {},
  handleChange: Function.prototype,
  handleSubmit: Function.prototype,
  intl: {
    formatMessage: ({ defaultMessage }) => defaultMessage,
  },
};

storiesOf('UserProfile', module).add('Default', () => (
  <Router history={history}>
    <UserProfile {...defaultProps} />
  </Router>
));
