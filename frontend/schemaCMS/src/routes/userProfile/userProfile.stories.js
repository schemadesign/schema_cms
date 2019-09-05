import React from 'react';
import { storiesOf } from '@storybook/react';

import { UserProfile } from './userProfile.component';
import { INITIAL_VALUES } from '../../modules/userProfile/userProfile.constants';

const defaultProps = {
  values: INITIAL_VALUES,
  handleChange: Function.prototype,
  handleSubmit: Function.prototype,
  intl: {
    formatMessage: Function.prototype,
  },
};

storiesOf('UserProfile', module).add('Default', () => <UserProfile {...defaultProps} />);
