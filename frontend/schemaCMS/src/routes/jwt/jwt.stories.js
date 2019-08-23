import React from 'react';
import { storiesOf } from '@storybook/react';

import { Jwt } from './jwt.component';

const location = {
  state: {
    token: 'qwerty123',
    user: 'user123',
  },
};

const defaultProps = {
  getJwtToken: Function.prototype,
  location,
};

storiesOf('Jwt', module).add('Default', () => <Jwt {...defaultProps} />);
